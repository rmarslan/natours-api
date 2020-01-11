const nodemailer = require('nodemailer');
const config = require('config');
const debug = require('debug')('natours:email');

const sendEmail = async options => {
  // 1) Create transporter
  const host = config.get('email.host');
  const port = config.get('email.port');
  const user = config.get('email.username');
  const password = config.get('emailPassword');
  debug('host: ', host);
  debug('Port: ', port);
  debug('user', user);
  debug('password', password);
  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: user,
      pass: password
    }
  });

  // 2) Send the email
  await transporter.sendMail({
    from: 'Arslan Rana <natours@test.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  });
};

module.exports = sendEmail;
