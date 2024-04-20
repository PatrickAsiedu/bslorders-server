const connection = require('../config/dbconfig').promise()
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
    const [menuDateQuery] = await connection.query(
      'SELECT menu_date, expires_at FROM menu WHERE id = ? ',
      [req.body.menu_id]
    )
    const menuDate = menuDateQuery[0].menu_date
    console.log('menu date: ', menuDate)
    // const expiresAt = new Date(menuDate.getTime() + (3600 * 1000 * 31));
    const expiresAt = menuDateQuery[0].expires_at

    console.log('expires at: ', expiresAt)
    const currentDate = new Date()
    // if time is less than 7; order else dont order
    if (currentDate.getTime() > expiresAt.getTime()) {
      return res.status(400).json({
        message: `Menu no longer accepting orders. Note: orders close at 7:00AM ie ${expiresAt}`,
        menuDate: menuDate,
        expiresAt,
      })
    }

    // Check for duplicate orders for same user.. only one order each menu
    const [checkRow] = await connection.query(
      'SELECT * FROM orders WHERE user_id = ? AND menu_id = ?',
      [userID, req.body.menu_id]
    )
    console.log(checkRow.length)
    if (checkRow.length === 1 || checkRow.length > 1) {
      return res.status(401).json({
        message:
          'You have ordered for this menu already, please edit or delete if you want to change or delete it',
        order: checkRow[0],
      })
    }

    const comment = req.body.comment === undefined ? '' : req.body.comment
    const [food] = await connection.query(
      'SELECT id, name FROM food WHERE id = ?',
      [req.body.food_id]
    )
    const [drink] = await connection.query(
      'SELECT id, name FROM drink WHERE id = ?',
      [req.body?.drink_id]
    )
    console.log('chechking here')
    console.log(food)
    console.log(drink)

    // query to insert into orders table
    const [orderQuery] = await connection.query(
      'INSERT INTO orders (user_id, menu_id, food_id, food_name, drink_id, drink_name, comment, created_at) VALUES (?,?,?,?,?,?,?,?)',
      [
        userID,
        req.body.menu_id,
        food[0].id,
        food[0].name,
        drink[0]?.id,
        drink[0]?.name,
        comment,
        new Date(),
      ]
    )

    if ((orderQuery.affectedRows = 0)) {
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
    const [row] = await connection.query(
      'DELETE FROM orders where user_id = ? AND id = ?',
      [userID, req.body.order_id]
    )

    if (row.affectedRows === 1) {
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
    const [result] = await connection.query(
      'SELECT orders.id, food_id, food_name, drink_id, drink_name, comment, menu_id, orders.created_at, menu.menu_date FROM orders inner join menu on orders.menu_id = menu.id WHERE user_id = ?',
      [userID]
    )

    if (result.length === 0) {
      return res.status(401).json({
        message: 'No order found for user, please order and try again',
      })
    }

    return res.status(200).json({
      message: 'Success',
      data: result,
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
    const [menuDateQuery] = await connection.query(
      'SELECT menu_date, expires_at FROM menu inner join  orders  on menu.id = orders.menu_id where orders.id = ? ',
      [req.body.order_id]
    )
    console.log(menuDateQuery)
    const menuDate = menuDateQuery[0].menu_date
    console.log('menu date: ', menuDate)
    const expiresAt = menuDateQuery[0].expires_at

    console.log('expires at: ', expiresAt)
    const currentDate = new Date()
    // if time is less than 7; order else dont order
    if (currentDate.getTime() > expiresAt.getTime()) {
      return res.status(400).json({
        message: `Menu no longer accepting orders. Note orders close at 07:00 following day ie ${expiresAt}`,
        menuDate: menuDate,
        expiresAt,
      })
    }

    const comment = req.body.comment === undefined ? '' : req.body.comment
    const [food] = await connection.query(
      'SELECT id, name FROM food WHERE id = ?',
      [req.body.food_id]
    )
    const [drink] = await connection.query(
      'SELECT id, name FROM drink WHERE id = ?',
      [req.body?.drink_id]
    )

    const [row] = await connection.query(
      'UPDATE orders SET food_id = ?, food_name = ?, drink_id = ?, drink_name = ?, comment = ?, updated_at = ? WHERE id = ? AND user_id = ?',
      [
        food[0].id,
        food[0].name,
        drink[0]?.id,
        drink[0]?.name,
        comment,
        new Date(),
        req.body.order_id,
        userID,
      ]
    )

    if (row.affectedRows === 1) {
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
    const [menuQuery] = await connection.query(
      'SELECT id FROM menu WHERE menu_date =? ',
      [queryDate]
    )
    console.log(menuQuery)

    if (menuQuery.length === 0) {
      return res.status(400).json({
        message: 'No order found for this date',
        date: queryDate,
      })
    }

    // now lets get all orders by menu id
    const [ordersQuery] = await connection.query(
      'SELECT orders.id, menu_id, name, food_name, food_id, drink_name, drink_id, comment, orders.created_at FROM orders INNER JOIN users on orders.user_id = users.id where menu_id = ?',
      [menuQuery[0].id]
    )

    if (ordersQuery.length === 0) {
      return res.status(400).json({
        message: 'No order placed for this menu yet',
        date: queryDate,
      })
    }

    return res.status(200).json({
      message: 'Success',
      data: ordersQuery,
    })
  } catch (error) {
    next(error)
  }
}
