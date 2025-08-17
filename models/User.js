const { Schema, model, SchemaTypes } = require("mongoose");
const bcrypt = require("bcryptjs");

const User = new Schema(
  {
    username: {
      type: String,
      minlength: 2,
      required: true,
      unique: true
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      minlength: 2,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 2,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: false,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    balance: {
      type: Number,
      required: false,
      default: 0
    },
    totalIncome: {
      type: Number,
      required: false,
      default: 0
    },
    totalSpend: {
      type: Number,
      required: false,
      default: 0
    },
    limitForThisMonth:{
      type: Number,
      required: false,
      default: 0
    },
    spendThisMonth:{
      type: Number,
      required: false,
      default: 0
    },
    incomeThisMonth:{
      type: Number,
      required: false,
      default: 0
    },
    expenses: [{
      type: Schema.Types.ObjectId,
      ref: 'Expense'
    }],
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }],
    description: {
      type: String,
      required: false,
    },
    work: {
      type: String,
      required: false,
    },
    hobby: {
      type: String,
      required: false,
    },
    birthDate: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    verificationToken: { 
      type: String 
    }
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

User.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

User.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("user", User);