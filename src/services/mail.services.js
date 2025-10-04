const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dhirajkr344725@gmail.com",
    pass: "gltoawzzadztecmf",
  },
});


const sendEmail = async (to, subject, html) => {
  const info = {
    from: '"dhiraj singh" <dhirajkr344725@gmail.com>',
    to: to,
    subject,
    html
  }

 return await transporter.sendMail(info);
}

module.exports = sendEmail;

