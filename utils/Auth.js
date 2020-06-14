const passport = require("passport");
const User = require("../models/User");

const userAuth = passport.authenticate("jwt", { session: false });

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).send("Unauthorized")
    : next();

module.exports = {
  userAuth,
  validateEmail,
  checkRole,
};
