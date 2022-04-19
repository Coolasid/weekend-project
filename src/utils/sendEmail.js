const nodemailer = require('nodemailer');

const sendMail = async (email) => {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'coolasid123@gmail.com',
      pass: 'Siddesh9575',
    },
  });

  const mailOptions = {
    from: 'coolasid123@gmail.com',
    to: email,
    subject: 'Regarding account verification',
    text: "account verification link",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent' + info.response);
    }
  });
};

module.exports = sendMail;
