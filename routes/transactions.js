const express = require("express");
const router = express.Router();

const { auth } = require('../middlewares');
const { Expense, User } = require('../models')
console.log("Expense model loaded:", Expense);
router.get("/", auth, async (req, res, next) => {
  try {
    const userId = req.user._id; // assuming auth middleware sets this

    const expenses = await Expense.find({ author: userId })

    return res.json(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});



// router.get("/:postId", async (req, res, next) => {
//   const { postId } = req.params;
//   try {
//     const post = await Posts.findById(postId)
//       .populate("tags")
//       .populate("author")
//       .populate({ path: "comments", populate: { path: "author" } });

//     return res.json(post);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

router.post(
  "/",
  auth,
  async (req, res, next) => {
    try {
      // console.log(req)
      const new_expense = await Expense.create({
        ...req.body,
        author: req.user.id,
        type: '-'
      });


      req.user.expenses.push(new_expense);
      req.user.totalSpend = req.user.totalSpend - req.body.amount;
      req.user.balance = req.user.balance - req.body.amount;
      await req.user.save();
      return (res.json(new_expense), res.status(200));
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

router.post(
  "/incomeAdd",
  auth,
  async (req, res, next) => {
    try {
      // console.log(req)
      const new_expense = await Expense.create({
        ...req.body,
        author: req.user.id,
        type: '+'
      });

      req.user.expenses.push(new_expense);
      req.user.totalIncome = req.user.totalIncome + +req.body.amount;
      req.user.balance = req.user.balance + +req.body.amount;
      await req.user.save();
      return (res.json(new_expense), res.status(200));
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);


module.exports = router;