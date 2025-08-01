const express = require("express");
const router = express.Router();

const { auth } = require('../middlewares');
const { Expense, User } = require('../models')
console.log("Expense model loaded:", Expense);
router.get("/", auth, async (req, res, next) => {
  try {
    const userId = req.user._id; // assuming auth middleware sets this

    const expenses = await Expense.find({ author: userId }).populate('category')

    return res.json(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});



router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const transaction = await Expense.findById(id)
      .populate("author")
      .populate('category')

    return res.json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/sum", auth, async (req, res, next) => {
  const userId = req.user._id;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await Expense.find({ author: userId });

    let totalIncome = 0;
    let totalSpend = 0;
    let incomeThisMonth = 0;
    let spendThisMonth = 0;

    transactions.forEach(tx => {
      const isIncome = tx.sum >= 0;
      const isThisMonth = new Date(tx.date) >= startOfMonth && new Date(tx.date) <= endOfMonth;

      if (isIncome) {
        totalIncome += tx.sum;
        if (isThisMonth) incomeThisMonth += tx.sum;
      } else {
        totalSpend += Math.abs(tx.sum); // Make spend positive for reporting
        if (isThisMonth) spendThisMonth += Math.abs(tx.sum);
      }
    });

    const balance = totalIncome - totalSpend;

    return res.json({
      balance,
      totalIncome,
      totalSpend,
      incomeThisMonth,
      spendThisMonth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const updatedTransaction = await Expense.findByIdAndUpdate(
      id,
      { amount },
      { new: true }
    ).populate("author");

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json(updatedTransaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await Expense.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/expense",
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
  "/income",
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