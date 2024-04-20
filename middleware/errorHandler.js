const { body } = require('express-validator')
const { header } = require('express-validator')

exports.validateLogin = [
  body('phone_number', 'No phone number provided').notEmpty(),
  body('phone_number', 'Please provide a valid phone number of length 10')
    .isInt()
    .isLength({ min: 10, max: 10 }),
  body('password', 'No password provided').notEmpty().trim(),
]

exports.validatePhoneNumber = [
  body('phone_number', 'No phone number provided')
    .notEmpty()
    .isLength({ min: 10, max: 10 }),
]

exports.validateRegister = [
  body('name', 'Please provide a valid fullname')
    .notEmpty()
    .isAlpha('en-US', { ignore: ' ' })
    .trim(),
  body('phone_number', 'No phone number provided').notEmpty(),
  body('phone_number', 'Please provide a valid phone number of length 10')
    .isInt()
    .isLength({ min: 10, max: 10 }),
  body('password', 'No password provided').notEmpty().trim(),
]

exports.validateAddUser = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body('name', 'Please provide a valid fullname')
    .notEmpty()
    .isAlpha('en-US', { ignore: ' ' })
    .trim(),
  body('phone_number', 'No phone number provided').notEmpty(),
  body('phone_number', 'Please provide a valid phone number of length 10')
    .isInt()
    .isLength({ min: 10, max: 10 }),
  body('password', 'No password provided').notEmpty().trim(),
  body('type', 'Please specify a type for the user, must be either chef, user or admin')
    .notEmpty().isAlpha()
]

exports.validateEditUser = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body('name', 'Please provide a valid fullname')
    .notEmpty()
    .isAlpha('en-US', { ignore: ' ' })
    .trim(),
  body('phone_number', 'No phone number provided').notEmpty(),
  body('phone_number', 'Please provide a valid phone number of length 10')
    .isInt()
    .isLength({ min: 10, max: 10 }),
]

exports.validateGetUser = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body('phone_number', 'No phone number provided').notEmpty(),
  body('phone_number', 'Please provide a valid phone number of length 10')
    .isInt()
    .isLength({ min: 10, max: 10 }),
  body('password', 'No password provided').notEmpty().trim(),
]

exports.validateAddFood = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body('foods', 'No food name provided').notEmpty(),
]

exports.validateAddDrink = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body('drinks', 'No drink name provided').notEmpty(),
]

exports.validateAddMenu = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body('foods_id', 'Please provide a valid food ids').notEmpty().isInt(),
  // body('drinks_id', 'Please provide a valid drink ids').isInt(),
  body('menu_date', 'NO menu date provided').notEmpty(),
]

exports.validateOrder = [
  // body('drink_id', 'Please enter a valid drink id').notEmpty().isInt(),
  body('food_id', 'Please enter a valid food id').notEmpty().isInt(),
  body('menu_id', 'Please provide a valid menu id').notEmpty().isInt(),
  //body('comment', 'Please provide a valid comment').notEmpty().trim()
]

exports.validateGetOrder = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
]

// delete
exports.validateDeleteFood = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body(
    'food_id',
    'Please enter a food id for the food you want to delete'
  ).notEmpty(),
  body('food_id', 'Food id must be an interger greater than 0').isInt({
    min: 0,
  }),
]

exports.validateDeleteDrink = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body(
    'drink_id',
    'Please enter a drink id for the drink you want to delete'
  ).notEmpty(),
  body('drink_id', 'Drink id must be an interger greater than 0').isInt({
    min: 0,
  }),
]

exports.validateDeleteMenu = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body(
    'menu_id',
    'Please enter a menu id for the menu you want to delete'
  ).notEmpty(),
  body('menu_id', 'Menu id must be an interger greater than 0').isInt({
    min: 0,
  }),
]

exports.validateDeleteUser = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body(
    'user_id',
    'Please enter a user id for the user you want to delete'
  ).notEmpty(),
]

exports.validateDeleteOrder = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body(
    'order_id',
    'Please provide the id of the order you want to deletel'
  ).notEmpty(),
  body('order_id', 'ORder id must be an interger greater than 0').isInt({
    min: 0,
  }),
]

// edit
exports.validateEditFood = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body(
    'food_id',
    'Please enter a food id for the food you want to edit'
  ).notEmpty(),
  body(
    'food_name',
    'Please enter a new name for the food you want to edit'
  ).notEmpty(),
]

exports.validateEditDrink = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body(
    'drink_id',
    'Please enter a drink id for the drink you want to edit'
  ).notEmpty(),
  body(
    'drink_name',
    'Please enter a name for the drink you want to edit'
  ).notEmpty(),
]

exports.validateEditMenu = [
  body('menu_id', 'Please enter a menu id for the menu you want to edit')
    .notEmpty()
    .trim(),
  body('menu_id', "Please provide a valid menu_id")
    .isInt(),
  body(
    'foods_id',
    'Please provide  a valid food id'
  ).notEmpty().isInt(),
  // body(
  //   'drinks_id',
  //   'Please provide a valid drink id'
  // ).notEmpty(),
  body('menu_date', 'NO menu date provided').notEmpty(),
]

exports.validateEditOrder = [
  body('order_id', 'Please provide a valid order id').notEmpty().isInt(),
  body(
    'food_id',
    'Please add a food_id for the new food, if you dont want to edit it, just maintain the old one'
  )
    .notEmpty()
    .isInt()
    .trim(),
  // body(
  //   'drink_id',
  //   'Please add a drink_id for the new drink, if you dont want to edit it, just maintain the old one'
  // )
  //   .isInt()
  //   .trim(),
  body(
    'comment',
    'Please add a comment for the new comment, if you dont want to edit it, just maintain the old one'
  )
    .trim(),
]

exports.validateApproveUser = [
  header(
    'Authorization',
    'No token provided. Please provide a valid token'
  ).notEmpty(),
  body('user_id', 'Please provide a valid user id').notEmpty().isInt(),
]


