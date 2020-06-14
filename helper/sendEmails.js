const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { GMAIL, GMAIL_PASSWORD, SECRET, WEBAPP_URL } = require("../config");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "587",
  auth: {
    user: GMAIL,
    pass: GMAIL_PASSWORD,
  },
  secureConnection: "false",
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

const sendFormLinkToUser = (email) => {
  const token = jwt.sign({ email }, SECRET, {
    expiresIn: "2h",
  });

  //change URL to React ROUTER
  const url = `${WEBAPP_URL}/form/${token}`;

  const mailOptions = {
    from: '"TechStack - No Reply " <noreply.hostel.daiict@gmail.com>',
    to: `${String(email)}`,
    subject: "TechStack Form",
    html:
      `Hello, <br>` +
      `<p>Please click <a href="${url}">here</a> to fill up the form.</p>` +
      `<p>Please fill this from within <strong>two hours</strong>. After that link is expire.</p><br>` +
      "Regards, <br>" +
      "TechStack",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Message sent: %s", info.messageId);
  });
};

const sendAdminRegistrationLink = (email) => {
  const token = jwt.sign({ email, role: "admin" }, SECRET, {
    expiresIn: "10m",
  });

  //change URL to React ROUTER
  const url = `${WEBAPP_URL}/auth/token/${token}`;

  const mailOptions = {
    from: '"TechStack No Reply " <noreply.hostel.daiict@gmail.com>',
    to: `${String(email)}`,
    subject: "TechStack Admin Registration",
    html:
      `Hello, <strong>Admin</strong> <br>` +
      `<p>Please click <a href="${url}">here</a> to fill up the form.</p>` +
      `<p>Please fill this from within <strong>10 minutes</strong>. After that link is expire.</p><br>` +
      "Regards, <br>" +
      "TechStack",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Message sent: %s", info.messageId);
  });
};

// sendAdminRegistrationLink(ADMIN_EMAIL);

module.exports = {
  sendFormLinkToUser,
  sendAdminRegistrationLink,
};
