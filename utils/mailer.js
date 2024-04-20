// function send orders via mail or whatsapp
const nodemailer = require('nodemailer');


// const date = new Date(Date.now()).toISOString().split('T')[0];

exports.mailer = (date) => {

    // create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    port: 587,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: 'developerr411@gmail.com',
            pass: '@developerr411@',
         },
    secure: false,
});

const mailData = {
    from: 'developerr411@gmail.com',  // sender address
    to: 'k.owusu-ansah@broadspectrumltd.com, kwaku315@gmail.com, k.mills@broadspectrumltd.com',   // list of receivers
    subject: `BSL - Lunch Orders for ${date}`,
    text: `Hi, please find attache BSL Lunch orders for ${date}`,
    html: `<b>Hey there!, </b> <br/> <p>please find attached BSL Lunch orders for ${date} </p>`,
    attachments: [
        {
            filename: `orders-${date}.csv`,
            path: `orders-${date}.csv`
        },
    ]
};

transporter.sendMail(mailData, (err, info) => {
    if(err){
        console.log(err)
    }else{
        console.log(info)
    }
});


;}


    