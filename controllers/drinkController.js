const connection = require('../config/dbconfig').promise();
const { handlerForAllErrors} = require('../utils/utils');

exports.addDrink = async ( req, res, next) => {
    // TODO error handling
    handlerForAllErrors(req, res);

    // only chef and admin can add drink
    const { chef, admin } = req.user;
    if(!admin && !chef ) {
        return res.status(400).json({
            message: "You need to log in as either chef or admin to add drink"
        })
    }
    
    try {
        // client returns an array of drinks... map through and store in db with ids.
        req.body.drinks.map(async(drink) => {
            const [ row ] = await connection.query(
                'INSERT INTO drink (name, created_at) VALUES (? , ?)', [drink, new Date()]
            )
            if(row.affectedRows===1){
                console.log('succes; item added succesfully')
            }else{
                console.log('faied: cant add item')
            }
        } )

        return res.status(200).json({
            message: "drinks added successfully"
        })
         
        
    } catch (error) {
        next(error)
        
    }
}



exports.getDrinks = async(req, res, next) => {
    // TODO error handling
    handlerForAllErrors(req, res);

    // once you log in, you can get drinks
    // get loggedIn user's id
    const userID = req.user.user?.id || req.user.chef?.id || req.user.admin?.id 
    console.log(userID)
    
    try {

        const [ result ] = await connection.query(
            'SELECT id, name, created_at FROM drink WHERE status = "ACTIVE" '
        )

        if(result.length === 0 ){
            return res.status(401).json({
                message: "No drink added, please add drinks and try again"
            })
        }

        return res.status(200).json({
            message: "success",
            drinks: result
        })
  
        
    } catch (error) {
        next(error)
        
    }
}

exports.deleteDrink =  async(req, res, next) => {
    // TODO error handling
    handlerForAllErrors(req, res);

    // only chef and admin can add drink
    const { chef, admin } = req.user;
    if(!admin && !chef ) {
        return res.status(400).json({
            message: "You need to log in as either chef or admin to delete drink"
        })
    }
    
    try {
        const [ row ] = await connection.query(
            " UPDATE drink SET status = 'DELETED' WHERE  id = ? ", [req.body.drink_id]
        )

        if(row.affectedRows === 1){
            res.status(200).json({
                message: 'Drink item deleted successfully'
            })
        } else {
            res.status(400).json({
                error: "Cannot delete",
                message: "Drink with specified id does not exit"
            })
        }
        
    } catch (error) {
        next(error)
    }
}


exports.editDrink =  async(req, res, next) => {
    // TODO error handling
    handlerForAllErrors(req, res);
    
    // only chef and admin can add drink
    const { chef, admin } = req.user;
    if(!admin && !chef ) {
        return res.status(400).json({
            message: "You need to log in as either chef or admin to edit drink"
        })
    }
    
    try {
        const [row] = await connection.query(
            'UPDATE drink SET name = ?, updated_at = ? WHERE id = ?',
            [req.body.drink_name, new Date(), req.body.drink_id ]
        )
        // console.log(row)

        if( row.affectedRows === 1){
            res.status(200).json({
                message: "Drink updated successfully"
            })
        }else{
            res.status(400).json({
                error: "Failed to update drink",
                message: "Cannot edit drink, please try again or contact me"
            })
        }
        
    } catch (error) {
        next(error)
        
    }
}