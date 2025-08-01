const { Schema, model } = require("mongoose");

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // optional but recommended
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
});

module.exports = model("Category", CategorySchema);