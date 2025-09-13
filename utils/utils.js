const pool = require('../config/dbconfig')
const { validationResult } = require('express-validator')

exports.getItemID = async (item, tableName) => {
  const resultID = await pool.query(
    `SELECT id FROM ${tableName} WHERE name = $1`,
    [item]
  )
  // console.log(resultID)
  return resultID.rows[0]?.id
}

exports.handlerForAllErrors = (req, res) => {
  // TODO: change default msg to message, param to parameter and remove the location
  const errorFormater = ({ msg, param, location }) => {
    return {
      message: msg,
      location: `[${param}] in ${location}`,
    }
  }

  const errors = validationResult(req).formatWith(errorFormater)
  // console.log(errors)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array(),
    })
  }
}
