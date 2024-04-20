// this controller handles login and register
// and user hadnlers adduer, deleteUser, EditUSer, getUSer

const connection = require('../config/dbconfig').promise()
const jwt = require('jsonwebtoken')
const { handlerForAllErrors } = require('../utils/utils')
const bcrypt = require('bcrypt')
const authenticator = require('../middleware/authenticatorMiddleware')

exports.login = async (req, res, next) => {
  // TODO error handling
  handlerForAllErrors(req, res)

  try {
    const [result] = await connection.query(
      'SELECT id, name, phone_number, password, type, status FROM users  WHERE phone_number = ? ;',
      [req.body.phone_number]
    )

    //check if number exist numbers
    if (result.length === 0) {
      return res.status(401).json({
        message: 'Phone number entered is incorrect',
      })
    }

    //phone number exist, check password
    // destructure to take out id and pass using ec6 rest format
    const { id, password, ...restResult } = result[0]
    //check password using bcrypt
    const passCheck = await bcrypt.compare(req.body.password, password)

    if (!passCheck) {
      return res.status(401).json({
        message: 'Password entered is incorrect',
      })
    }

    let response

    console.log('here', restResult.status)
    switch (restResult.status) {
      case 'PENDING':
        response = res.status(400).json({
          message: 'Login not successful, user account has not been approved',
        })
        break
      case 'DISABLED':
        response = res.status(400).json({
          message: 'Login not successful, user account has been deactivated',
        })
      case 'BLOCKED':
        response = res.status(400).json({
          message: 'Login not successful, user account has been blocked',
        })
        break
      case 'RESET_REQUIRED':
        response = res.status(400).json({
          message: 'Login not successful, password reset requested',
        })
        break
      case 'ACTIVE':
        //generate token and add to the response message
        const loginToken = jwt.sign(
          {
            id,
            name: restResult.name,
            phone_number: restResult.phone_number,
            type: restResult.type,
            status: restResult.status,
          },
          'secretekey1234'
        )
        response = res.status(202).json({
          message: 'Login successful',
          data: {
            token: loginToken,
            user: restResult,
          },
        })
    }
    return response
  } catch (error) {
    next(error)
  }
}

exports.register = async (req, res, next) => {
  // error handling
  handlerForAllErrors(req, res)

  try {
    // check if phone number exists
    const [result] = await connection.query(
      'SELECT * FROM users WHERE phone_number = ? ',
      [req.body.phone_number]
    )
    if (result.length > 0) {
      return res.status(400).json({
        error: {
          message: `Phone number exists already`,
        },
      })
    }

    // if no type is specified, then he must be a normal user
    const type = req.body.type !== undefined ? req.body.type : 'user' //this is redundant
    const status = req.body.status !== undefined ? req.body.status : 'PENDING' //this is redundant

    const dateNow = new Date()
    const hashPass = await bcrypt.hash(req.body.password, 15)
    const [row] = await connection.query(
      'INSERT INTO users (name, phone_number, password, type, created_at) VALUES ( ?, ?, ?,?, ?);',
      [req.body.name, req.body.phone_number, hashPass, type, dateNow]
    )
    if (row.affectedRows === 1) {
      //success
      const [result] = await connection.query(
        'SELECT * FROM users WHERE phone_number = ? ',
        [req.body.phone_number]
      )
      return res.status(201).json({
        message: 'User registered successfuly, waiting for approval',
      })
    }
  } catch (error) {
    next(error)
  }
}

// this routes approves user, changes status from 0 to 1
exports.resetPassword = async (req, res, next) => {
  // TODO: error \
  handlerForAllErrors(req, res)

  try {
    // only admin can access this
    const { admin } = req.user
    if (!admin) {
      return res.status(400).json({
        message: 'You need to log in as an admin to reset passwords',
      })
    }

    const hashPass = await bcrypt.hash(req.body.password, 15)

    let [row] = []

    try {
      ;[row] = await connection.query(
        'UPDATE users SET password = ?, status = "ACTIVE" WHERE phone_number = ?',
        [hashPass, req.body.phone_number]
      )
    } catch (error) {
      console.log(error)
    }

    if (row.affectedRows === 1) {
      return res.status(201).json({
        message: 'Password reset successfully',
      })
    } else {
      return res.status(400).json({
        message: 'Failed to reset password.',
      })
    }
  } catch (error) {
    next(error)
  }
}

// this routes resets user, changes status from 0 to 1
exports.approveUser = async (req, res, next) => {
  // TODO: error \
  handlerForAllErrors(req, res)

  try {
    // only admin can access this
    const { admin } = req.user
    if (!admin) {
      return res.status(400).json({
        message: 'You need to log in as an admin to reset passwords',
      })
    }

    // query to approve user
    const [row] = await connection.query(
      'UPDATE users SET status = "ACTIVE" WHERE id = ?',
      [req.body.user_id]
    )

    if (row.affectedRows === 1) {
      return res.status(200).json({
        message: 'User approved successfully',
      })
    } else {
      return res.status(400).json({
        message: 'Cannot approve user.',
      })
    }
  } catch (error) {
    next(error)
  }
}

// this routes approves user, changes status from whatever to 2
exports.deactivateUser = async (req, res, next) => {
  // TODO: error \
  handlerForAllErrors(req, res)

  const user_id = req.body.user_id
  // todo... check for status first

  try {
    // only admin can access this
    authenticator.admin(req, res)

    const [row] = await connection.query(
      'UPDATE users SET status = "DISABLED" WHERE id = ?',
      [user_id]
    )

    if (row.affectedRows === 1) {
      return res.status(201).json({
        message: 'User blocked successfully',
      })
    } else {
      return res.status(400).json({
        message: 'Cannot block user.',
      })
    }
  } catch (error) {
    next(error)
  }
}

//forgot password method

exports.forgotPassword = async (req, res, next) => {
  // TODO
  handlerForAllErrors(req, res)

  try {
    // check if phone number exists
    const [result] = await connection.query(
      'SELECT * FROM users WHERE phone_number = ? ',
      [req.body.phone_number]
    )

    if (result.length > 0) {
      //update the user's status to inactive

      try {
        const [result] = await connection.query(
          'UPDATE users set status = "RESET_REQUIRED" WHERE phone_number = ? ',
          [req.body.phone_number]
        )
      } catch (error) {
        console.log(error)
      }

      return res.status(201).json({
        message: 'Password reset requested. Please contact the administrator',
      })
    } else {
      return res.status(201).json({
        message: 'User does not exist',
      })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.passwordResetRequests = async (req, res, next) => {
  // TODO: error \
  handlerForAllErrors(req, res)

  try {
    // only admin can access this
    const { admin } = req.user
    if (!admin) {
      return res.status(400).json({
        message: 'You need to log in as an admin to reset passwords',
      })
    }

    let [row] = []

    try {
      ;[row] = await connection.query(
        'SELECT name, phone_number, status from users where status = "RESET_REQUIRED"'
      )
    } catch (error) {
      console.log(error)
    }

    if (row.length >= 1) {
      return res.status(201).json({
        reset_requests: row,
      })
    } else {
      return res.status(401).json({
        message: 'No requests.',
      })
    }
  } catch (error) {
    next(error)
  }
}



exports.getAllAprovalRequest = async(req, res, next) =>{
  handlerForAllErrors(req, res);
  try {
    // only admin can do this
    const { admin } = req.user;
    if(!admin){
      return res.status(400).json({
        message: "You need to log in as admin in order to get all request"
      });
    };

    const [ userQuery ] = await connection.query(
      'SELECT id, name, phone_number, type, created_at, status FROM users  WHERE status = ?', ['PENDING']
    );

    if(userQuery.length === 0){
      return res.status(400).json({
        message: "No approval request available"
      })
    }

    return res.status(200).json({
      message: "Query successfull",
      data: userQuery
    })
    
  } catch (error) {
    next(error);
  }
};


exports.getAllUsers = async(req, res, next)=>{
  try {
    // only admin can do this
    const { admin, chef } = req.user;
    if(!admin && !chef){
      return res.status(400).json({
        message: "You need to log in as admin  or chef in order to get all users"
      });
    };

    // all clear, we can now get all users
    const [usersQuery] = await connection.query('SELECT id, name, phone_number, type, status, created_at FROM users')
    
    if(usersQuery.length===0){
      return res.status(400).json({
        message: "No user found"
      })
    }


    return res.status(200).json({
      message: "Query successfull",
      data: usersQuery
    })

    
  } catch (error) {
    next(error)
  }
};



exports.denyApprovalRequest = async(req, res, next)=>{
  handlerForAllErrors(req, res);
  try {
    // only admin can do this
    const { admin} = req.user;
    if(!admin){
      return res.status(400).json({
        message: "You need to log in as admin in order to deny this request"
      });
    };

    const [ denyQuery ] = await connection.query("UPDATE users SET status = 'BLOCKED' WHERE id = ? ", [req.body.user_id]);

    if(denyQuery.affectedRows === 0){
      return res.status(400).json({
        message: "Invalid user id passed"
      })
    }

    return res.status(200).json({
      message: "User's request denied successfully"
    })
    
  } catch (error) {
    next(error)
  }
}