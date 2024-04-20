// cron job logic
var cron = require('node-cron');
const { networkInterfaces } = require('nodemailer/lib/shared');
const { csvGenerator } = require('./csvGenerator');
const { errorMailer } = require('./errorMailer');
const { mailer } = require('./mailer');
const connection =  require('../config/dbconfig').promise();

// const date = new Date(Date.now()).toISOString().split('T')[0];

// function to get orders and generate its csv.
const getOrders = async(menu_date) => {
    // const menuId = 50;

    try {

        // day is a menu_, get its corresponding menu_id from the menu table
        const [menu_id] = await connection.query(
            'SELECT id FROM menu WHERE menu_date = ? ', [menu_date]
        )
        // console.log(menu_id[0].id)

        const [ result] =  await connection.query(
            'SELECT id, user_id, food_id, drink_id, comment FROM orders WHERE menu_id = ?', [menu_id[0].id]
        )

        if(result.length === 0){
            return (
                console.log('No orders yet')
            )   
        }

        // get food name and user name
        const orders = [];
        let no = 1
        for (var bb in result){
            const { id, user_id, food_id, drink_id, comment} = result[bb];
            const [userName] = await connection.query(
                'SELECT name FROM users WHERE id = ?', [user_id]
            )
            const [foodName] = await connection.query(
                'SELECT name FROM food WHERE id = ?', [food_id]
            )
            const [drinkName] = await connection.query(
                'SELECT name FROM drink WHERE id = ?', [drink_id]
            )
            // console.log(foodName[0].name, drinkName[0].name)
            const new_item = { id:no , "name": userName[0].name,"food":foodName[0].name, "drink":drinkName[0].name, comment, }
            orders.push(new_item)
            no++;
        }
    
        // generate csv for the orders
        csvGenerator(orders, menu_date);
        

        return (
            console.log('csv file generated successfully')
        )


    } catch (error) {
        console.log(error)
        // errorMailer(error);
    }

} 



exports.cronjobber  = () => {
    // const menuDate = '2022-03-12'
    // menu date is always the previous date
    var menuDate = new Date();
    menuDate.setDate(menuDate.getDate()-1);



    cron.schedule(`* ${process.env.cronTime} * * *`, () => {
        getOrders(menuDate);
        mailer(menuDate);
        console.log(`Cron job runs now ${Date.now()}`);

      });
}