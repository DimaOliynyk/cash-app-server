const { User } = require('../models')
const jwt = require('jsonwebtoken');
const { attachment } = require('express/lib/response');
const bcrypt = require('bcryptjs');
const Category = require('../models/CategorySchema'); // Adjust path accordingly
const Expense = require('../models/Expense.js')
const nodemailer = require("nodemailer");

async function createDefaultCategoriesForUser(userId) {
  const defaultCategories = [
    { name: 'Food', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', author: userId },
    { name: 'Transport', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448672.png', author: userId },
    { name: 'Entertainment', iconUrl: 'https://cdn-icons-png.flaticon.com/512/727/727240.png', author: userId },
    { name: 'Health', iconUrl: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png', author: userId },
    {
      name: 'Work',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      author: userId
    }
  ];

  const categories = await Category.insertMany(defaultCategories);
  return categories;
}

const transporter = nodemailer.createTransport({
  service: "gmail", // or custom SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.register = async (req, res) => {
  try {
    const { email } = req.body
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      res.status(409).json({ message: 'This username is already in use.' });
      return;
    }
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      verificationToken,
    });

    const payload = {
      _id: newUser._id,
    };

    // Create default categories for this user
    const categories = await createDefaultCategoriesForUser(newUser._id);

    // Optionally add categories to user's categories array
    newUser.categories = categories.map(cat => cat._id);
    
    const jwToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify/${newUser.verificationToken}`;

    await newUser.save();

    // await transporter.sendMail({
    //   to: email,
    //   subject: "Verify your email",
    //   html: `<p>Click <a href="${verifyLink}">here</a> to verify your account</p>`
    // });



    res.json({
      user: newUser,
      token: jwToken,
      message: "Registration successful! Check your email to verify your account."
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
exports.verify = async (req, res) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate('categories').populate('expenses') ;
    if (!user || !(await user.validPassword(req.body.password))) {
      res.status(400).json({ message: 'invalid credentials' });
      return;
    }

    if(user.isVerified === false){
      res.status(403).json({ message: 'email is not verified' });
      return;
    }

    const payload = {
      _id: user._id,
    };

    const jwToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      user: user,
      token: jwToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.me = async (req, res) => {
  try {
    const existingUser = await User.findById(req.user._id).populate('categories') ;
      // .populate('likedPosts')
      // .populate('likedComments')
      // .populate('readingList');

    if (!existingUser) {
      res.status(409).json({ message: "This user doesn't exist." });
      return;
    }
    res.json({
      user: existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};