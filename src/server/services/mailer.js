const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'mail.consultant.ru',
  port: 25,
  secure: false,
  auth: {
    user: 'sender-reports@consultant.ru',
    pass: '28hd73hY'
  }
});

const sendReport = async (subject, text) => {

  const mailOptions = {
    from: 'sender-reports@consultant.ru',
    to: 'novoseltsevms@consultant.ru',
    subject: subject,
    html: text
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  sendReport
};
