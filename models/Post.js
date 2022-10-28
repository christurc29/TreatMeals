const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  restaurant: {
    type: String,
    required: true,
  },

  calories: {
    type: Number,
    required: true,
  },

  dish: {
    type: String,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  totalcarbohydrates: {
    type: Number,
    required: true,
  },
  totalfat: {
    type: Number,
    required: true,
  },
  bookmarks: {
    type: Array,
    required: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
  },
  likes: {
    type: Array,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
