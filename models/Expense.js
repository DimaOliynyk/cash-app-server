const { Schema, model, SchemaTypes } = require("mongoose");
const { number } = require("yup");

const Expense = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Unnamed Expense'
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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category', // reference to your Category model
      required: false,  // optional, but recommended to require in your app logic
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


module.exports = model("Expense", Expense);