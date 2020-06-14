const { Schema, model } = require("mongoose");

const InfoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    IDcardURL: {
      type: String,
      required: true,
    },
    registrationType: {
      type: String,
      enum: ["self", "group", "corporate", "others"],
    },
    registrationID: {
      type: String,
      required: true,
      unique: true,
    },
    ticket: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("informations", InfoSchema);
