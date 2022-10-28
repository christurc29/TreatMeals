const { text } = require("express");
const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        post: req.params.id,
        user: req.user.id,
        rating: req.body.rating,
      });
      console.log(req.body)
      console.log("Comment has been added!");
      res.redirect("/post/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      
      // Delete post from db
      await Comment.remove({ _id: req.params.id });
      console.log("Deleted Comment");
      res.redirect(`/post/${req.query.post}`);
    } catch (err) {
      res.redirect(`/post/${req.query.post}`);
    }
  }
};
