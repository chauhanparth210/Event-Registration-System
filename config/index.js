require("dotenv").config();

module.exports = {
  DB: process.env.MONGO_DB,
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  GMAIL: process.env.GMAIL,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  WEBAPP_URL: process.env.WEBAPP_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};
