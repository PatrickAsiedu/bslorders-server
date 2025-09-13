const pool = require('../config/dbconfig')
const { handlerForAllErrors } = require('../utils/utils')
const jwt = require('jsonwebtoken')

exports.addFood = async (req, res, next) => {
  // TODO error handling
  handlerForAllErrors(req, res)

  // only chef and admin can add drink
  const { chef, admin } = req.user
  if (!admin && !chef) {
    return res.status(400).json({
      message: 'You need to log in as either chef or admin to add drink',
    })
  }

  try {
    // client returns an array of foods... map through and store in db with ids.
    var statusCode = 201
    var message = ''
    for (const food of req.body.foods) {
      const row = await pool.query(
        'INSERT INTO food (name, created_at) VALUES ($1, $2) RETURNING id',
        [food, new Date()]
      )
      if (row.rows.length === 1) {
        console.log('success: item added successfully')
      } else {
        console.log('failed: cant add item')
      }
    }
    return res.status(200).json({
      message: 'foods added successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.getFoods = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, created_at from food  WHERE status = 'ACTIVE'"
    )
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'No food added, please add foods and try again',
      })
    }

    return res.status(200).json({
      message: 'Successfull',
      foods: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

exports.deleteFood = async (req, res, next) => {
  // TODO error handling
  handlerForAllErrors(req, res)

  // only chef and admin can add drink
  const { chef, admin } = req.user
  console.log('chef', Boolean(chef))
  console.log('admin', Boolean(admin))
  if (!admin && !chef) {
    return res.status(400).json({
      message: 'You need to log in as either chef or admin to delete Food',
    })
  }

  try {
    const row = await pool.query('UPDATE food SET status = $1 WHERE id = $2', [
      'DELETED',
      req.body.food_id,
    ])
    if (row.rowCount === 1) {
      res.status(200).json({
        message: 'Food item deleted successfully',
      })
    } else {
      res.status(400).json({
        error: 'Cannot delete food',
        message: 'Food item with specified id does not exist',
      })
    }
  } catch (error) {
    next(error)
  }
}

exports.editFood = async (req, res, next) => {
  // TODO error handling
  handlerForAllErrors(req, res)

  // only chef and admin can add drink
  const { chef, admin } = req.user
  if (!chef && !admin) {
    return res.status(400).json({
      message: 'You need to log in as either chef or admin to edit Food',
    })
  }

  try {
    const row = await pool.query(
      'UPDATE food SET name = $1, updated_at = $2 WHERE id = $3',
      [req.body.food_name, new Date(), req.body.food_id]
    )
    if (row.rowCount === 1) {
      res.status(200).json({
        message: 'Food updated successfully',
      })
    } else {
      res.status(400).json({
        error: 'Failed to update food',
        message: 'Food with specified id doest not exist',
      })
    }
  } catch (error) {
    next(error)
  }
}
