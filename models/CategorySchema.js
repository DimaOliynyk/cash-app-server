const { Schema, model } = require("mongoose");

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  iconUrl: {
    type: String, // Optional: you can store an icon or color for UI
    required: false,
  },
  author: {  // Link category to a user
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  moneyFlow: {
    type: Number,
    default: 0
  }
});

CategorySchema.index({ name: 1, author: 1 }, { unique: true });

module.exports = model("Category", CategorySchema);