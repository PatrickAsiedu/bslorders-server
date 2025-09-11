const connection  = require('../config/dbconfig').promise();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { handlerForAllErrors} = require('../utils/utils');


exports.addUser = async (req, res, next) => {
    // error handling
    handlerForAllErrors(req, res);

    // only admin can delte user
    const { admin  } = req.user;
    if(!admin) {
        return res.status(400).json({
            message: "You need to log in as an admin to add this user"
        })
    }

    try {
        // check if phone number exists
        const [ result ] = await connection.query(
            'SELECT * FROM users WHERE phone_number = ? ',
            [req.body.phone_number]
        );
        if(result.length > 0) {
            return res.status(422).json({
                message: `Phone number exists already`
            })
        } 
        // if no type is specified, then he must be a normal user
        const type = req.body.type !== undefined ? req.body.type : 'user';
        

        const dateNow = new Date();
        const hashPass = await bcrypt.hash(req.body.password, 15);
        const [ row ] = await connection.query(
            'INSERT INTO users (name, phone_number, password, type, status, created_at) VALUES ( ?, ?, ?,?, ?, ?);',
            [req.body.name, req.body.phone_number, hashPass, type, 'ACTIVE', dateNow ]
        );
        if(row.affectedRows ===1 ){
            //success
            const [ result ] = await connection.query(
                'SELECT * FROM users WHERE phone_number = ? ',
                [req.body.phone_number]
                );
            return res.status(201).json({
                message: 'User added successfully successfuly'
            })
        } 
  
        
    } catch (error) {
        next(error)
    }
};





// check on this later on
exports.getUser = async (req, res,next) => {
    // TODO error handling
    handlerForAllErrors(req, res);

    // get loggedIn user's id
    const userID = req.user.user?.id || req.user.chef?.id || req.user.admin?.id 
    console.log(userID)

    try {
        //use id to query the user
        const [result ] = await connection.query(
            'SELECT * FROM users WHERE id = ? ',
            [userID]
        )

        console.log(result[0]);    
        return res.status(200).json({
            message: 'Successful',
            data :{
                user: result[0]
            } 
        });
        
    } catch (e) {
        if(e instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                error:{
                    message: 'invalid token'
                }
            })
        }
        next(e)  
    }

}



exports.deleteUser = async(req, res, next) => {
    // TODO error handling
    handlerForAllErrors(req, res);

    // only admin can delte user
    const { admin  } = req.user;
    if(!admin) {
        return res.status(400).json({
            message: "You need to log in as an admin to delete this user"
        })
    }


    try {
        const [row ] = await connection.query(
            'DELETE FROM users WHERE id = ?', [req.body.user_id]
        )

        if(row.affectedRows === 1){
            return res.status(200).json({
                message: "User deleted successfully"
            })
        }else {
            return res.status(400).json({
                message: "Cannot delete user, user does not exist"
            })
        }
        
    } catch (error) {
        next(error)
    }
}

exports.editUser = async( req, res, next) => {
    // TODO
    handlerForAllErrors(req, res);

    // only admin can delte user
    const { admin  } = req.user;
    if(!admin) {
        return res.status(400).json({
            message: "You need to log in as an admin to edit this user"
        })
    }

    const id = req.body.user_id;
    
    try {
        const [ row ] = await connection.query(
            'UPDATE users SET  name = ? , phone_number = ? where id = ?',
            [req.body.name, req.body.phone_number, id]
        )

        if(row.affectedRows === 1){
            res.status(200).json({
                message: "User updated successfully"
            })
        }else{
            res.status(400).json({
                message: "Failed to update user"
            })
        }

        
    } catch (error) {
        next(error)
    }
}

; 