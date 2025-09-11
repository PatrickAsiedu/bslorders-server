const express = require('express');
const routes = require('./routes/routes')
require('dotenv').config();
const cors = require('cors')
const { cronjobber } = require('./utils/cron-jobber')

const app = express();

// configure passport jwt for auth
require('./middleware/passport');

app.use(cors())
app.use(express.json());

//defautl route
app.get('/', (req, res) => {
    res.json({message: 'Welcome dude'})
});

app.use(routes)


// handling all errors
// default to 500 if not able to catch
app.use((err, req, res, next) => {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

const port = process.env.PORT || 3001;
const host = '0.0.0.0';


app.listen(port, host, ()=> {
    console.log(`App started and running succesfully on PORT ${port}`)
})

// configure the cronjobber
cronjobber();