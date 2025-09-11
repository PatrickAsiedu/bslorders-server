const { mailer } = require('./mailer');

// cron job to get orders and save as csv
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const date = new Date(Date.now()).toISOString().split('T')[0];

// this code exports the result to csv
exports.csvGenerator = (result, menu_date) => {
    const csvWriter = createCsvWriter({
        path: `orders-${menu_date}.csv`,
        header: [
            {id: 'id', title: 'No'},
            {id: 'name', title: 'Name'},
            {id: 'food', title: 'Food'},
            {id: 'drink', title: 'Drink'},
            {id: 'comment', title: 'Comment'}
        ]
    });
     
    csvWriter.writeRecords(result)       // returns a promise
        .then(() => {
            console.log('...Done');
            return 1
        })
        .catch((error)=>
        mailer(error));

// now lets send data an email address
        
    
    
}