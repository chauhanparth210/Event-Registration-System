const { Schema, model } = require("mongoose");

const EmailSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    isFilledForm: {
      type: Boolean,
      required: true,
      default: false,
    },
    attempt: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = model("emails", EmailSchema);
