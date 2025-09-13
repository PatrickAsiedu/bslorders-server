// this controller handles login and register
// and user hadnlers adduer, deleteUser, EditUSer, getUSer

const pool = require('../config/dbconfig')
const jwt = require('jsonwebtoken')
const { handlerForAllErrors } = require('../utils/utils')
const bcrypt = require('bcrypt')

exports.login = async (req, res, next) => {
  // TODO error handling
  handlerForAllErrors(req, res)

  try {
    const result = await pool.query(
      'SELECT id, name, phone_number, password, type, status FROM users  WHERE phone_number = $1',
      [req.body.phone_number]
    )
    // console.log(result)

    //check if number exist numbers
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Login Failed',
        error: {
          messsage: 'Phone number entered is incorrect',
        },
      })
    }

    //if phone number exist, check password
    if (result.rows.length === 1) {
      // destructure to take out id and pass using ec6 rest format
      const { id, password, ...restResult } = result.rows[0]
      // console.log(restResult)
      //check password using bcrypt
      const passCheck = await bcrypt.compare(req.body.password, password)

      if (!passCheck) {
        return res.status(401).json({
          message: 'Login Failed',
          error: {
            messsage: 'Password entered is incorrect',
          },
        })
      }

      // pass match, next check the status [0-pendind, 1-approved, 2-rejected]
      if (passCheck) {
        //generate token and add to the response message
        const loginToken = jwt.sign({ id }, 'secretekey1234')
        return res.status(202).json({
          message: 'Login successful',
          data: {
            token: loginToken,
            user: restResult,
          },
        })
      } else {
        return res.status(401).json({
          message: 'Login Failed',
          error: {
            messsage: 'Password entered is incorrect',
          },
        })
      }
    }
  } catch (error) {
    next(error)
  }
}

exports.register = async (req, res, next) => {
  // error handling
  handlerForAllErrors(req, res)

  try {
    // check if phone number exists
    const result = await pool.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [req.body.phone_number]
    )
    if (result.rows.length > 0) {
      return res.status(422).json({
        error: {
          message: `Phone number exists already`,
        },
      })
    }

    // if no type is specified, then he must be a normal user
    const type = req.body.type !== undefined ? req.body.type : 0
    const status = req.body.status !== undefined ? req.body.status : 0

    const dateNow = new Date()
    const hashPass = await bcrypt.hash(req.body.password, 15)
    const row = await pool.query(
      'INSERT INTO users (name, phone_number, password, type, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.body.name, req.body.phone_number, hashPass, type, dateNow]
    )
    if (row.rows.length === 1) {
      //success
      return res.status(201).json({
        message: 'User registered successfuly, waiting for approval',
      })
    }
  } catch (error) {
    next(error)
  }
}
