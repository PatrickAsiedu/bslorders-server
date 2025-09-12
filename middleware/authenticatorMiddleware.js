// implement auth middleware
const jwt = require('jsonwebtoken');

exports.admin = async(req, res) => {
    try {
        const token = jwt.verify(req.headers.authorization?.split(' ')[1], process.env.SECRET_OR_KEY);
    
        console.log(token)
        if(token.type !=="admin"){
            return res.status(401).json({
                message: "You must log in as admin in order to proceed"
            })
        }
    } catch (error) {
        console.log(error)
    }
    
} 

exports.chef = async(req, res) => {
    try {

        if(token.type !=="chef"){
            return res.status(401).json({
                message: "You must log in as chef in order to proceed"
            })
        }
    } catch (error) {
        console.log(error)
    }
} 


exports.user = async(req, res) => {
    try {
        const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_OR_KEY)
        if(token.type !=="user"){
            return res.status(401).json({
                message: "You must log in as user in order to proceed"
            })
        }
    } catch (error) {
        console.log(error)
    }
} 


// exports.adminOrChef = async(req, res) => {
//     try {
//         const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_OR_KEY)
//         if(token.type === 0){
//             return res.status(401).json({
//                 message: "You must log in as admin or chef in order to proceed"
//             })
//         }
//     } catch (error) {
//         console.log(error)
//     }
// } 