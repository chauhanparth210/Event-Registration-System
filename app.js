const express = require("express");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const cors = require("cors");
const passport = require("passport");
const helmet = require("helmet");

const User = require("./models/User");
const { PORT, DB, ADMIN_EMAIL } = require("./config");
// const { sendAdminRegistrationLink } = require("./helper/sendEmails");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(passport.initialize());

require("./middleware/passport")(passport);

app.use("/api/user", require("./routes/auth"));
app.use("/api/form", require("./routes/form"));
app.use("/api/admin", require("./routes/admin"));

const startApp = async () => {
  try {
    await connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    success({ message: "Successfully connected with Database", badge: true });
    app.listen(PORT, () => {
      success({ message: `Server is running on PORT:${PORT}`, badge: true });
    });

    //code for admin registration

    // const admin = await User.find({ email: String(ADMIN_EMAIL) });
    // if (admin) {
    //   sendAdminRegistrationLink(String(ADMIN_EMAIL));
    //   success({
    //     message: `Send Admin Registration link on :${ADMIN_EMAIL}`,
    //     badge: true,
    //   });
    // }
  } catch (e) {
    error({ message: `Unable to connect with Database`, badge: true });
  }
};

startApp();

app.use(function (req, res, next) {
  return res.status(404).send({ message: "Route" + req.url + " Not found." });
});

app.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});
