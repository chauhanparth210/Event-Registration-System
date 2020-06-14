const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");
const { validateEmail } = require("../utils/Auth");

const userRegister = async (userData, role, res) => {
  try {
    let emailNotRegistered = await validateEmail(userData.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: "Email is already taken.",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(userData.password, 12);

    const newUser = new User({
      ...userData,
      password: hashPassword,
      role,
    });
    await newUser.save();
    return res.status(201).json({
      message: "Hurry! now  you are successfully registered.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unable to create account",
      success: false,
    });
  }
};

const userLogin = async (userCreds, role, res) => {
  try {
    let { email, password } = userCreds;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({
        message: "Username is not found. Invalid login credentials.",
        success: false,
      });
    }
    if (user.role !== role) {
      return res.status(400).json({
        message: "Opos! you are not unauthorized to perform this operation",
        success: false,
      });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = jwt.sign(
        {
          user_id: user._id,
          role: user.role,
          name: user.name,
          email: user.email,
        },
        SECRET,
        {
          expiresIn: "3h",
        }
      );

      let result = {
        name: user.name,
        role: user.role,
        email: user.email,
        token: "Bearer " + token,
        expiresIn: "3 hours",
      };

      return res.status(201).json({
        ...result,
        message: "Yep! you are logged in.",
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Unable to logged in! try after some time",
      success: false,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
};
