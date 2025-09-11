const connection = require('../config/dbconfig').promise()
const { handlerForAllErrors } = require('../utils/utils')

exports.addMenu = async (req, res, next) => {
  // TODO error handling
  handlerForAllErrors(req, res)

  console.log(req.body)
  // only chef can add drink
  const { chef, admin } = req.user
  if (!chef && !admin) {
    return res.status(400).json({
      message: 'You need to log in as chef or admin to add Food Menu',
    })
  }
  const menuDate = new Date(req.body.menu_date)

  // if its admin and he doesnt pass the chef id, return an error
  if (admin && req.body?.chef_id === undefined) {
    return res.status(400).json({
      message: 'Please provide a valid chef iD',
    })
  }

  console.log(req.body)

  try {
    const currentDate = new Date()
    // console.log(currentDate, menuDate);
    // check menu date to be always ahead of date created
    if (currentDate > menuDate) {
      return res.status(400).json({
        error: 'Failed to add menu',
        message:
          'Invalid menu date, it must always be ahead of date menu is created',
      })
    }

    // check if menu has been added already for the menudate
    const [result] = await connection.query(
      'SELECT * FROM menu WHERE menu_date = ? ',
      [req.body.menu_date]
    )
    if (result.length > 0) {
      return res.status(400).json({
        error: 'Failed to add menu',
        message:
          'You have added menu for the specified date already, please select another date',
      })
    }

    // first insert into menu table and get the id generated
    // menu needs: menu_date, created_by and created_at
    // const user_name = req.user?.chef.name || req.user?.admin.name;
    console.log(menuDate)
    console.log(req.body)
    const expires_at = new Date(menuDate.getTime() + 3600 * 1000 * 7)

    // TODO: created_by should be id, not name
    // and if its admin, he should compulsory pass the chef's id

    const chefID = req.body.chef_id || req.user?.chef.name
    console.log('line 73: ', chefID)
    const [menu_query] = await connection.query(
      'INSERT INTO menu (menu_date, expires_at, created_by, created_at) values (?,?,?,?)',
      [req.body.menu_date, expires_at, chefID, currentDate]
    )

    // insert id =  query.insertId
    // check if query is successful
    if ((menu_query.affectedRows = 0)) {
      return res.status(400).json({
        message: 'Failed to add menu, please try again',
      })
    }

    // insert into menu_food
    // cols are menu_id, food_id, food_name and default created_at

    // lets get corresponding names of all the food in an object
    const foods = []
    for (var food_id of req.body.foods_id) {
      const [foodName] = await connection.query(
        'SELECT id, name FROM food WHERE id = ? ',
        [food_id]
      )
      foods.push(foodName[0])
    }
    console.log(foods)
    for (var food of foods) {
      const [result] = await connection.query(
        'INSERT INTO menu_food (menu_id, food_id, food_name, created_at) values (?,?,?,?)',
        [menu_query.insertId, food.id, food.name, new Date()]
      )
    }

    // lets get corresponding names of all the food in an object
    const drinks = []
    for (var drink_id of req.body.drinks_id) {
      const [drinkName] = await connection.query(
        'SELECT id, name FROM drink WHERE id = ? ',
        [drink_id]
      )
      drinks.push(drinkName[0])
    }
    console.log(drinks)
    for (var drink of drinks) {
      const [result] = await connection.query(
        'INSERT INTO menu_drink (menu_id, drink_id, drink_name, created_at) values (?,?,?,?)',
        [menu_query.insertId, drink.id, drink.name, new Date()]
      )
    }

    // if you have reached here, then everything is okay, very perfect.
    return res.status(201).json({
      message: 'Menu added successfully',
    })
  } catch (error) {
    next(error)
  }
}

//this returns menu for the day
exports.getMenu = async (req, res, next) => {
  // get logged in user's id
  const userID = req.user.user?.id || req.user.chef?.id || req.user.admin?.id
  // console.log(userID)

  var menuDate = new Date()
  // if menu date time if before 7am get today, else get tommorrow

  if (!req.query.menu_date) {
    menuDate.getHours() < 7
      ? menuDate
      : menuDate.setDate(menuDate.getDate() + 1)
    // if current time is after 7:00 get tommorrow's menu else today.
  } else {
    menuDate = new Date(req.query.menu_date)
  }
  console.log('menu date from query is:', req.query.menu_date)
  console.log('menu date generated', menuDate.toISOString().split('T')[0])
  // const menuDate = req.query.menu_date;

  // const dateNow = new Date();
  // // console.log(dateNow.getHours())
  // if(dateNow.getHours()< 7){
  //   setMenuQueryDate(dateNow.toISOString().split('T')[0])
  //   // console.log(dateNow.toISOString().split('T')[0])
  //   console.log("current time before 07:00AM.... so we are getting today's menu ie. ", menuQueryDate)
  // }
  // else{
  //   let tomorrow =  new Date()
  //   tomorrow.setDate(dateNow.getDate() + 1)
  //   setMenuQueryDate(tomorrow.toISOString().split('T')[0])
  //   // console.log(tomorrow.toISOString().split('T')[0])
  //   console.log("Current time after 07:00AM .... so we are getting tommorow's menu ie. ", menuQueryDate)
  // }

  try {
    const [result] = await connection.query(
      'SELECT * FROM menu where menu_date = ? AND status = "ACTIVE" ',
      [menuDate.toISOString().split('T')[0]]
      // menuDate.toISOString().split('T')[0]
    )
    console.log(result)
    if (result.length === 0) {
      return res.status(401).json({
        message: 'No menu found for specified date, please check and try again',
        date: menuDate.toISOString().split('T')[0],
      })
    }

    // foodquery
    const [foodQuery] = await connection.query(
      'select menu_id, food_id, food_name, created_by, menu_date, expires_at from menu_food  join menu on menu.id = menu_food.menu_id where menu.menu_date = ? ',
      [menuDate.toISOString().split('T')[0]]
    )

    console.log(foodQuery)

    const foods = foodQuery.map((foodItem) => {
      const { food_id, food_name } = { ...foodItem }
      return { food_id, food_name }
    })

    // drinkquery
    const [drinkQuery] = await connection.query(
      'select menu_id, drink_id, drink_name, created_by, menu_date from menu_drink inner join menu on menu.id = menu_drink.menu_id where menu_date = ? ',
      [menuDate.toISOString().split('T')[0]]
    )

    const drinks = drinkQuery.map((drinkItem) => {
      const { drink_id, drink_name } = { ...drinkItem }
      return { drink_id, drink_name }
    })

    // TODO: return users order if he has already ordered.
    // const momoMills = 0553064776;
    // const order = [];

    // get logged in user's id
    const userID = req.user.user?.id || req.user.chef?.id || req.user.admin?.id
    const [checkOrrderQuery] = await connection.query(
      'SELECT orders.id, food_id, food_name, drink_id, drink_name, comment, menu_id, orders.created_at, menu.menu_date, menu.expires_at FROM orders inner join menu on orders.menu_id = menu.id WHERE user_id = ? AND menu_date = ?',
      [userID, menuDate.toISOString().split('T')[0]]
    )

    return res.status(200).json({
      message: 'Query successful',
      data: {
        menu_id: foodQuery[0].menu_id,
        foods,
        drinks,
        created_by: foodQuery[0].created_by,
        menu_date: foodQuery[0].menu_date,
        expires_at: foodQuery[0].expires_at,
        user_order: checkOrrderQuery,
      },
    })
  } catch (error) {
    next(error)
  }
}

// get all menu from time immemorial
exports.getAllMenu = async (req, res, next) => {
  try {
    const [foodQuery] = await connection.query(
      'SELECT menu_id, food_id, food_name, created_by, menu_date FROM menu_food INNER JOIN menu ON menu.id = menu_food.menu_id WHERE menu.status ="ACTIVE" '
    )
    const [drinkQuery] = await connection.query(
      'SELECT menu_id, drink_id, drink_name, created_by, menu_date FROM menu_drink INNER JOIN menu ON menu.id = menu_drink.menu_id WHERE menu.status ="ACTIVE" '
    )

    // console.log(foodQuery)
    console.log(
      '........................get all orders........................'
    )
    const menus = []

    const unique_menu_ids = [...new Set(foodQuery.map((item) => item.menu_id))]
    for (var menu_id of unique_menu_ids) {
      const menu = {}
      menu.menu_id = menu_id
      const individualFoodItems = foodQuery.filter(
        (fooditems) => fooditems.menu_id === menu_id
      )
      const foods = individualFoodItems.map((foodItem) => {
        const { food_id, food_name } = { ...foodItem }
        return { food_id, food_name }
      })

      const individualDrinkItems = drinkQuery.filter(
        (drinkitems) => drinkitems.menu_id === menu_id
      )
      const drinks = individualDrinkItems.map((drinkItem) => {
        const { drink_id, drink_name } = { ...drinkItem }
        return { drink_id, drink_name }
      })

      // set all items
      menu.foods = foods
      menu.drinks = drinks
      menu.created_by = individualFoodItems[0].created_by
      menu.menu_date = individualFoodItems[0].menu_date
      menus.push(menu)
    }

    //  console.log(foodQuery)

    return res.status(200).json({
      message: 'Query successful',
      data: menus,
    })
  } catch (error) {
    next(error)
  }
}

// edit/ iupdate  menu
exports.editMenu = async (req, res, next) => {
  // TDOD: error handling
  handlerForAllErrors(req, res)

  // only chef can edit menu
  const { chef, admin } = req.user
  if (!chef && !admin) {
    return res.status(400).json({
      message: 'You need to log in as chef or admin to edit Food Menu',
    })
  }

  // if its admin and he doesnt pass the chef id, return an error
  if (admin && req.body?.chef_id === undefined) {
    return res.status(400).json({
      message: 'Please provide a valid chef iD to proceed',
    })
  }

  const menuDate = new Date(req.body.menu_date)
  try {
    const currentDate = new Date()
    // console.log(currentDate, menuDate);
    // check menu date to be always ahead of date created
    if (currentDate > menuDate) {
      return res.status(400).json({
        error: 'Failed to update menu',
        message:
          'Invalid menu date, it must always be ahead of date menu is created',
      })
    }

    // delete all instances in menu_food with the menu_id
    await connection.query('DELETE from menu_food WHERE menu_id = ?', [
      req.body.menu_id,
    ])

    // now inset into new records with the updated data from req
    // lets get corresponding names of all the food in an object
    const foods = []
    for (var food_id of req.body.foods_id) {
      const [foodName] = await connection.query(
        'SELECT id, name FROM food WHERE id = ? ',
        [food_id]
      )
      foods.push(foodName[0])
    }
    console.log('updated foods:', foods)
    for (var food of foods) {
      const [result] = await connection.query(
        'INSERT INTO menu_food (menu_id, food_id, food_name, created_at) values (?,?,?,?)',
        [req.body.menu_id, food.id, food.name, new Date()]
      )
    }

    // delete all instances in tbl_drink with the menu_id
    await connection.query('DELETE from menu_drink WHERE menu_id = ?', [
      req.body.menu_id,
    ])

    // then, insert into the menu_drink updated items
    // lets get corresponding names of all the food in an object
    const drinks = []
    for (var drink_id of req.body.drinks_id) {
      const [drinkName] = await connection.query(
        'SELECT id, name FROM drink WHERE id = ? ',
        [drink_id]
      )
      drinks.push(drinkName[0])
    }
    console.log('updated drinks:', drinks)
    for (var drink of drinks) {
      const [result] = await connection.query(
        'INSERT INTO menu_drink (menu_id, drink_id, drink_name, created_at) values (?,?,?,?)',
        [req.body.menu_id, drink.id, drink.name, new Date()]
      )
    }

    // TODO: set  updated_at in menu to current date
    // ideally it should be the last task
    const [menu_query] = await connection.query(
      'UPDATE menu set updated_at = ? ',
      [new Date()]
    )
    if (menu_query.affectedRows > 0) {
      return res.status(200).json({
        message: 'Menu updated successfully',
      })
    }
  } catch (error) {
    next(error)
  }
}

// delete menu
exports.deleteMenu = async (req, res, next) => {
  // TODO error handling
  handlerForAllErrors(req, res)

  /// only chef can delete menu
  const { chef, admin } = req.user
  if (!chef && !admin) {
    return res.status(400).json({
      message: 'You need to log in as chef or admin to delete this menu',
    })
  }

  if (!req.query.menu_id) {
    return res.status(400).json({
      message: 'No menu id passed',
    })
  }
  console.log(req.query)

  try {
    // check if date hasnt  past, cos you cant delete future menus
    const [menuQuery] = await connection.query(
      'SELECT * FROM menu where id = ?',
      [req.query.menu_id]
    )

    if (menuQuery.length === 0) {
      return res.status(400).json({
        message: 'No menu found for specified id',
      })
    }

    console.log(menuQuery[0].menu_date)

    const currentDate = new Date()
    const menuDate = new Date(menuQuery[0].menu_date)
    console.log(menuDate > currentDate)
    if (menuDate < currentDate) {
      return res.status(400).json({
        message:
          'You cannot delete past menus, only future menus are deletable',
        menuDate,
        currentDate,
      })
    }

    // return res.status(200).json({
    //     message: "we can delet enow",
    //     menuDate,
    //     currentDate
    // })

    await connection.query('DELETE from menu where id = ? ', [
      req.query.menu_id,
    ])
    // delete all instances in menu_food with the menu_id
    await connection.query('DELETE from menu_food WHERE menu_id = ?', [
      req.query.menu_id,
    ])

    // delete all instances in tbl_drink with the menu_id
    await connection.query('DELETE from menu_drink WHERE menu_id = ?', [
      req.query.menu_id,
    ])

    return res.status(200).json({
      message: 'Menu item deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
