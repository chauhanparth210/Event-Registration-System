const CryptoJS = require("crypto-js");
const {
  validateInput,
  validateUserData,
  validateToken,
} = require("../utils/Form");
const { sendFormLinkToUser } = require("../helper/sendEmails");
const Email = require("../models/Emails");
const Info = require("../models/Information");
const { SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const sendFormLink = async (UserData, res) => {
  const isValid = await validateInput(UserData.email);
  console.log(isValid, "email validation");
  if (isValid) {
    const findEmail = await Email.findOne({ email: UserData.email });
    if (findEmail) {
      if (findEmail.attempt >= 3) {
        await res.status(400).json({
          message: `Contact to TechStack IT support`,
          success: false,
        });
      } else {
        findEmail.attempt += 1;
        await findEmail.save();
        sendFormLinkToUser(UserData.email);
        await res.status(201).json({
          message: "Check your email",
          success: true,
        });
      }
    } else {
      const newEmail = new Email({
        email: UserData.email,
        isFilledForm: false,
        attempt: 1,
      });
      await newEmail.save();
      sendFormLinkToUser(UserData.email);
      await res.status(201).json({
        message: "Check your email",
        success: true,
      });
    }
  } else {
    return await res.status(400).json({
      message: "Please provide valid input",
      success: false,
    });
  }
};

const CryptoJSAesJson = {
  stringify: function (cipherParams) {
    var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
    if (cipherParams.iv) j.iv = cipherParams.iv.toString();
    if (cipherParams.salt) j.s = cipherParams.salt.toString();
    return JSON.stringify(j);
  },
  parse: function (jsonStr) {
    var j = JSON.parse(jsonStr);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    });
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
    return cipherParams;
  },
};

const postUserData = async (UserData, token, res) => {
  const isValidToken = await validateToken(token);
  if (isValidToken) {
    let decryptedData = JSON.parse(
      CryptoJS.AES.decrypt("" + JSON.stringify(UserData), SECRET, {
        format: CryptoJSAesJson,
      }).toString(CryptoJS.enc.Utf8)
    );

    decryptedData = {
      name: `${decryptedData.fname} ${decryptedData.lname}`,
      email: decryptedData.email,
      mobile: decryptedData.mobile,
      ticket: decryptedData.ticket,
      IDcardURL: decryptedData.IDcardURL,
      registrationType: decryptedData.registrationType,
      registrationID: decryptedData.registrationID,
    };

    const isValid = await validateUserData(decryptedData);
    console.log(isValid, "userData validation");

    if (isValid) {
      const newUserData = new Info({
        ...decryptedData,
      });
      await newUserData.save();
      await res.status(201).json({
        message: "Registration successful",
        success: true,
      });
      let decoded = jwt.verify(token, SECRET);
      // console.log(decoded);
      await Email.updateOne(
        { email: decoded.email, isFilledForm: false },
        {
          $set: {
            isFilledForm: true,
          },
        }
      );
    } else {
      return await res.status(400).json({
        message: "Please provide valid inputs",
        success: false,
      });
    }
  } else {
    return res.status(400).json({
      message: "Token is expired",
      success: false,
    });
  }
};

const isTokenExpired = async (token, res) => {
  try {
    const isvalidToken = await validateToken(token);
    if (isvalidToken) {
      return res.status(201).json({
        success: true,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Token is expired",
      success: false,
    });
  }
};

module.exports = {
  sendFormLink,
  postUserData,
  isTokenExpired,
};
