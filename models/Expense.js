const { Schema, model, SchemaTypes } = require("mongoose");
const { number } = require("yup");

const Expense = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    type: {
      type: String,
      required: true,
    },
  },
  
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);


module.exports = model("expense", Expense);