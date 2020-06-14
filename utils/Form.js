const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

const schema = Joi.object({
  email: Joi.string().email({
    tlds: { allow: ["com", "net", "in"] },
  }),
});

const userDataValidator = Joi.object({
  name: Joi.string().min(2).max(40).required(),
  email: Joi.string()
    .email({
      tlds: { allow: ["com", "net", "in"] },
    })
    .required(),
  mobile: Joi.string().required(),
  IDcardURL: Joi.string().required(),
  ticket: Joi.number().required(),
  registrationType: Joi.string()
    .valid("self", "group", "corporate", "others")
    .required(),
  registrationID: Joi.string().required(),
});

const validateInput = async (email) => {
  try {
    const { error, value } = await schema.validateAsync({ email: email });
    if (error) throw new Error(error);
    return true;
  } catch (err) {
    return false;
  }
};

const validateUserData = async (userData) => {
  // console.log(userData)
  try {
    const { error, value } = await userDataValidator.validateAsync(userData);
    if (error) throw new Error(error);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const validateToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, function (err, decoded) {
      if (err) {
        reject(false);
        console.log(err);
      } else resolve(true);
    });
  });
};

module.exports = { validateInput, validateUserData, validateToken };
