// this block of code sends email to the developers when the cron jobber faills.

const nodemailer = require('nodemailer');

const date = new Date(Date.now()).toISOString().split('T')[0];

exports.errorMailer = (error) => {

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
    to: 'k.owusu-ansah@broadspectrumltd.com, kwaku315@gmail.com, k.mills@broadspectrumltd.com, p.asiedu@broadspectrumltd.com, j.dunyo@broadspectrumltd.com, d.vanderpuije@broadspectrumltd.com',   // list of receivers
    subject: `BSL - Lunch App Server Error ${date}`,
    text: `Hi, please find attache BSL Lunch orders for ${date}`,
    html: `<b>Hey developers, </b> <br/> <p> The server has recorded an error with the following information ${JSON.stringify(error)}. <br/> <br/><p> <pPlease check the logs on the server for more info</p> <p>Date: ${date}</p> `,
};

transporter.sendMail(mailData, (err, info) => {
    if(err){
        console.log(err)
    }else{
        console.log(info)
    }
});


;}