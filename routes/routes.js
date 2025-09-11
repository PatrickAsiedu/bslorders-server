const router = require('express').Router()
const passport = require('passport')

const {
  login,
  register,
  approveUser,
  deactivateUser,
  forgotPassword,
  resetPassword,
  passwordResetRequests,
  getAllAprovalRequest,
  getAllUsers,
  denyApprovalRequest,
} = require('../controllers/authController')
const {
  addUser,
  getUser,
  deleteUser,
  editUser,
} = require('../controllers/userController')
const {
  addOrder,
  deleteOrder,
  getOrders,
  editOrder,
  getOrdersDaily,
} = require('../controllers/orderController')
const {
  getDrinks,
  addDrink,
  deleteDrink,
  editDrink,
} = require('../controllers/drinkController')
const {
  getFoods,
  addFood,
  deleteFood,
  editFood,
} = require('../controllers/foodsController')
const {
  getMenu,
  addMenu,
  deleteMenu,
  editMenu,
  getAllMenu,
} = require('../controllers/menuController')

// import middlewares
const {
  validateLogin,
  validateRegister,
  validateAddUser,
  validateGetUser,
  validateDeleteUser,
  validateEditUser,
  validatePhoneNumber,

  validateAddFood,
  validateDeleteFood,
  validateEditFood,

  validateAddDrink,
  validateDeleteDrink,
  validateEditDrink,

  validateAddMenu,
  validateDeleteMenu,
  validateEditMenu,

  validateOrder,
  validateDeleteOrder,
  validateEditOrder,
  validateApproveUser,
  validateGetOrder,
} = require('../middleware/errorHandler')
const { session } = require('passport/lib')

//configure application routes

// auth routes
router.post('/api/login', validateLogin, login)
router.post('/api/register', validateRegister, register)
router.post('/api/forgot-password', validatePhoneNumber, forgotPassword)
router.post(
  '/api/reset-password',
  passport.authenticate('jwt', { session: false }),
  validateLogin,
  resetPassword
)
router.get(
  '/api/get-password-reset-requests',
  passport.authenticate('jwt', { session: false }),
  passwordResetRequests
)

// user routes
router.post(
  '/api/user',
  passport.authenticate('jwt', { session: false }),
  validateAddUser,
  addUser
)
router.get(
  '/api/user',
  passport.authenticate('jwt', { session: false }),
  validateGetUser,
  getUser
)
router.delete(
  '/api/user',
  passport.authenticate('jwt', { session: false }),
  validateDeleteUser,
  deleteUser
)
router.put(
  '/api/user',
  passport.authenticate('jwt', { session: false }),
  validateEditUser,
  editUser
)
router.put(
  '/api/user/approve',
  passport.authenticate('jwt', { session: false }),
  validateApproveUser,
  approveUser
)
router.put(
  '/api/user/block',
  passport.authenticate('jwt', { session: false }),
  validateDeleteUser,
  deactivateUser
)

// food routes
router.post(
  '/api/food',
  passport.authenticate('jwt', { session: false }),
  validateAddFood,
  addFood
)
router.get(
  '/api/food',
  passport.authenticate('jwt', { session: false }),
  getFoods
)
router.put(
  '/api/deletefood',
  passport.authenticate('jwt', { session: false }),
  validateDeleteFood,
  deleteFood
)
router.put(
  '/api/food',
  passport.authenticate('jwt', { session: false }),
  validateEditFood,
  editFood
)

// drink routes
router.post(
  '/api/drink',
  passport.authenticate('jwt', { session: false }),
  validateAddDrink,
  addDrink
)
router.get(
  '/api/drink',
  passport.authenticate('jwt', { session: false }),
  getDrinks
)
router.put(
  '/api/deletedrink',
  passport.authenticate('jwt', { session: false }),
  validateDeleteDrink,
  deleteDrink
)
router.put(
  '/api/drink',
  passport.authenticate('jwt', { session: false }),
  validateEditDrink,
  editDrink
)

// menu routes
router.post(
  '/api/menu',
  passport.authenticate('jwt', { session: false }),
  validateAddMenu,
  addMenu
)
router.get(
  '/api/menu',
  passport.authenticate('jwt', { session: false }),
  getMenu
)
router.get(
  '/api/menu/all',
  passport.authenticate('jwt', { session: false }),
  getAllMenu
);

router.delete(
  '/api/menu',
  passport.authenticate('jwt', { session: false }),
  // validateDeleteMenu,
  deleteMenu
)
router.put(
  '/api/menu',
  passport.authenticate('jwt', { session: false }),
  validateEditMenu,
  editMenu
)

// order routes
router.post(
  '/api/order',
  passport.authenticate('jwt', { session: false }),
  validateOrder,
  addOrder
)
router.delete(
  '/api/order',
  passport.authenticate('jwt', { session: false }),
  validateDeleteOrder,
  deleteOrder
)
router.get(
  '/api/order',
  passport.authenticate('jwt', { session: false }),
  validateGetOrder,
  getOrders
)
router.put(
  '/api/order',
  passport.authenticate('jwt', { session: false }),
  validateEditOrder,
  editOrder
)
router.get(
  '/api/order/daily',
  passport.authenticate('jwt', { session: false }),
  getOrdersDaily
)



// new routes
router.get(
  '/api/allapprovalrequests',
  passport.authenticate('jwt', {session: false}),
  getAllAprovalRequest
)

router.get(
  '/api/allusers',
  passport.authenticate('jwt', {session: false}),
  getAllUsers
)

router.put(
  '/api/approvalrequest/deny',
  passport.authenticate('jwt', {session:false}),
  denyApprovalRequest
)

module.exports = router
