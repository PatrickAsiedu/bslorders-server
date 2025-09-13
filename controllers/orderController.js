const pool = require('../config/dbconfig')
const { handlerForAllErrors } = require('../utils/utils')

exports.addOrder = async (req, res, next) => {
  // TODO error handling
  handlerForAllErrors(req, res)

  // anybody logged in can order
  const userID = req.user.user?.id || req.user.chef?.id || req.user.admin?.id
  console.log(userID)

  // TODO:
  // cant order for today's menu

  try {
    // TODO:
    // check the times of order and reject if time is passed
    const menuDateQuery = await pool.query(
      'SELECT menu_date, expires_at FROM menu WHERE id = $1',
      [req.body.menu_id]
    )
    const menuDate = menuDateQuery.rows[0].menu_date
    console.log('menu date: ', menuDate)
    // const expiresAt = new Date(menuDate.getTime() + (3600 * 1000 * 31));
    const expiresAt = menuDateQuery.rows[0].expires_at

    console.log('expires at: ', expiresAt)
    const currentDate = new Date()
    // if time is less than 7; order else dont order
    if (currentDate.getTime() > new Date(expiresAt).getTime()) {
      return res.status(400).json({
        message: `Menu no longer accepting orders. Note: orders close at 7:00AM ie ${expiresAt}`,
        menuDate: menuDate,
        expiresAt,
      })
    }

    // Check for duplicate orders for same user.. only one order each menu
    const checkRow = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 AND menu_id = $2',
      [userID, req.body.menu_id]
    )
    console.log(checkRow.rows.length)
    if (checkRow.rows.length >= 1) {
      return res.status(401).json({
        message:
          'You have ordered for this menu already, please edit or delete if you want to change or delete it',
        order: checkRow[0],
      })
    }

    const comment = req.body.comment === undefined ? '' : req.body.comment
    const food = await pool.query('SELECT id, name FROM food WHERE id = $1', [
      req.body.food_id,
    ])
    const drink = await pool.query('SELECT id, name FROM drink WHERE id = $1', [
      req.body?.drink_id,
    ])
    console.log('chechking here')
    console.log(food)
    console.log(drink)

    // query to insert into orders table
    const orderQuery = await pool.query(
      'INSERT INTO orders (user_id, menu_id, food_id, food_name, drink_id, drink_name, comment, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [
        userID,
        req.body.menu_id,
        food.rows[0].id,
        food.rows[0].name,
        drink.rows[0]?.id,
        drink.rows[0]?.name,
        comment,
        new Date(),
      ]
    )
    if (!orderQuery.rows[0]?.id) {
      return res.status(400).json({
        message: 'Failed to order, please try again',
      })
    }

    return res.status(202).json({
      message: 'Order placed successfully',
    })
  } catch (error) {
    next(error)
  }
}

// implement soft delete for this
exports.deleteOrder = async (req, res, next) => {
  // TODO error handling
  handlerForAllErrors(req, res)

  // get logged in user's id
  const userID = req.user.user?.id || req.user.chef?.id || req.user.admin?.id
  console.log(userID)

  try {
    // delete only order by user and specified by id
    const row = await pool.query(
      'DELETE FROM orders where user_id = $1 AND id = $2',
      [userID, req.body.order_id]
    )
    if (row.rowCount === 1) {
      res.status(200).json({
        message: 'Order item deleted successfully',
      })
    } else {
      res.status(400).json({
        error: 'Cannot delete',
        message: 'No order found with specified parameters',
      })
    }
  } catch (error) {
    next(error)
  }
}

// this is for getting list of all orders for the logged in user
exports.getOrders = async (req, res, next) => {
  // TODO error handling
  handlerForAllErrors(req, res)

  // get logged in user's id
  const userID = req.user.user?.id || req.user.chef?.id || req.user.admin?.id

  try {
    const result = await pool.query(
      'SELECT orders.id, food_id, food_name, drink_id, drink_name, comment, menu_id, orders.created_at, menu.menu_date FROM orders inner join menu on orders.menu_id = menu.id WHERE user_id = $1',
      [userID]
    )
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'No order found for user, please order and try again',
      })
    }

    return res.status(200).json({
      message: 'Success',
      data: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

exports.editOrder = async (req, res, next) => {
  // error handling
  handlerForAllErrors(req, res)

  // get logged in user's id
  const userID = req.user.user?.id || req.user.chef?.id || req.user.admin?.id
  try {
    // check the times of order and reject if time is passed
    const menuDateQuery = await pool.query(
      'SELECT menu_date, expires_at FROM menu inner join  orders  on menu.id = orders.menu_id where orders.id = $1',
      [req.body.order_id]
    )
    console.log(menuDateQuery.rows)
    const menuDate = menuDateQuery.rows[0].menu_date
    console.log('menu date: ', menuDate)
    const expiresAt = menuDateQuery.rows[0].expires_at

    console.log('expires at: ', expiresAt)
    const currentDate = new Date()
    // if time is less than 7; order else dont order
    if (currentDate.getTime() > new Date(expiresAt).getTime()) {
      return res.status(400).json({
        message: `Menu no longer accepting orders. Note orders close at 07:00 following day ie ${expiresAt}`,
        menuDate: menuDate,
        expiresAt,
      })
    }

    const comment = req.body.comment === undefined ? '' : req.body.comment
    const food = await pool.query('SELECT id, name FROM food WHERE id = $1', [
      req.body.food_id,
    ])
    const drink = await pool.query('SELECT id, name FROM drink WHERE id = $1', [
      req.body?.drink_id,
    ])

    const row = await pool.query(
      'UPDATE orders SET food_id = $1, food_name = $2, drink_id = $3, drink_name = $4, comment = $5, updated_at = $6 WHERE id = $7 AND user_id = $8',
      [
        food.rows[0].id,
        food.rows[0].name,
        drink.rows[0]?.id,
        drink.rows[0]?.name,
        comment,
        new Date(),
        req.body.order_id,
        userID,
      ]
    )
    if (row.rowCount === 1) {
      return res.status(200).json({
        message: 'Order updated successfully',
      })
    } else {
      return res.status(400).json({
        message: 'Failed to update order, No order exists for the specified id',
      })
    }
  } catch (error) {
    next(error)
  }
}

exports.getOrdersDaily = async (req, res, next) => {
  handlerForAllErrors(req, res)

  // only admin and chef can get orders by day user
  const { admin, chef } = req.user
  if (!admin && !chef) {
    return res.status(400).json({
      message:
        'You need to log in as either an admin or a chef to get all orders for the day',
    })
  }

  try {
    // TODO
    // if no date is passed, we use yesterdays date

    const currentDate = new Date()
    const queryDate = req.query.menu_date
      ? req.query.menu_date
      : currentDate.toISOString().split('T')[0]
    console.log(queryDate)

    // get menu id for this date
    const menuQuery = await pool.query(
      'SELECT id FROM menu WHERE menu_date = $1',
      [queryDate]
    )
    console.log(menuQuery.rows)
    if (menuQuery.rows.length === 0) {
      return res.status(400).json({
        message: 'No order found for this date',
        date: queryDate,
      })
    }

    // now lets get all orders by menu id
    const ordersQuery = await pool.query(
      'SELECT orders.id, menu_id, name, food_name, food_id, drink_name, drink_id, comment, orders.created_at FROM orders INNER JOIN users on orders.user_id = users.id where menu_id = $1',
      [menuQuery.rows[0].id]
    )
    if (ordersQuery.rows.length === 0) {
      return res.status(400).json({
        message: 'No order placed for this menu yet',
        date: queryDate,
      })
    }

    return res.status(200).json({
      message: 'Success',
      data: ordersQuery.rows,
    })
  } catch (error) {
    next(error)
  }
}
