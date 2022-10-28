const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const restaurants = await Restaurant.find().sort({ title: "asc" }).lean();
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", {
        posts: posts,
        user: req.user,
        restaurants: restaurants,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getMeals: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("my-meals.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getBookmarks: async (req, res) => {
    try {
      const posts = await Post.find({ bookmarks: req.user.id });
      console.log(posts);
      res.render("favorite-meals.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  getRestaurantFeed: async (req, res) => {
    if (req.query.sort == "lthc") {
      try {
        const rests = await Restaurant.find({ title: req.params.restname });

        const posts = await Post.find({ restaurant: req.params.restname }).sort(
          { calories: 1 }
        );

        var users = [];
        for (i in posts) {
          var user = await User.findById(posts[i].user);
          users.push(user.userName);
        }

        res.render("feed.ejs", {
          posts: posts,
          user: req.user,
          userName: users,
          restaurants: rests,
        });
      } catch (error) {
        console.log(error);
      }
    } else if (req.query.sort == "htlc") {
      try {
        const rests = await Restaurant.find({ title: req.params.restname });

        const posts = await Post.find({ restaurant: req.params.restname }).sort(
          { calories: -1 }
        );

        var users = [];
        for (i in posts) {
          var user = await User.findById(posts[i].user);
          users.push(user.userName);
        }

        res.render("feed.ejs", {
          posts: posts,
          user: req.user,
          userName: users,
          restaurants: rests,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const rests = await Restaurant.find({ title: req.params.restname });

        const posts = await Post.find({ restaurant: req.params.restname });

        var users = [];
        for (i in posts) {
          var user = await User.findById(posts[i].user);
          users.push(user.userName);
        }

        res.render("feed.ejs", {
          posts: posts,
          user: req.user,
          userName: users,
          restaurants: rests,
        });
      } catch (error) {
        console.log(error);
      }
    }
  },

  getAllFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      var users = [];
      for (i in posts) {
        var user = await User.findById(posts[i].user);
        users.push(user.userName);
      }

      res.render("feed.ejs", { posts: posts, user: req.user, userName: users });
    } catch (err) {
      console.log(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ post: req.params.id })
        .sort({ createdAt: "desc" })
        .lean();
      res.render("post.ejs", {
        post: post,
        user: req.user,
        comments: comments,
      });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        restaurant: req.body.restaurant,
        dish: req.body.dish,
        protein: req.body.protein,
        totalcarbohydrates: req.body.totalcarbohydrates,
        totalfat: req.body.totalfat,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        calories: req.body.calories,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/my-meals");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    var liked = false;
    try {
      var post = await Post.findById({ _id: req.params.id });
      liked = post.likes.includes(req.user.id);
    } catch (err) {}
    //if already liked we will remove user from likes array
    if (liked) {
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $pull: { likes: req.user.id },
          }
        );

        console.log("Removed user from likes array");
        res.redirect("back");
      } catch (err) {
        console.log(err);
      }
    }
    //else add user to like array
    else {
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $addToSet: { likes: req.user.id },
          }
        );

        console.log("Added user to likes array");
        res.redirect(`back`);
      } catch (err) {
        console.log(err);
      }
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/select-restaurant");
    } catch (err) {
      res.redirect("/select-restaurant");
    }
  },
  bookmarkPost: async (req, res) => {
    var bookmarked = false;
    try {
      var post = await Post.findById({ _id: req.params.id });
      bookmarked = post.bookmarks.includes(req.user.id);
    } catch (err) {}
    //if already bookmarked we will remove user from likes array
    if (bookmarked) {
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $pull: { bookmarks: req.user.id },
          }
        );

        console.log("Removed user from bookmarks array");
        res.redirect("back");
      } catch (err) {
        console.log(err);
      }
    }
    //else add user to bookmarked array
    else {
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $addToSet: { bookmarks: req.user.id },
          }
        );

        console.log("Added user to bookmarks array");
        res.redirect(`back`);
      } catch (err) {
        console.log(err);
      }
    }
  },

  createRestaurant: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Restaurant.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        cuisine: req.body.cuisine,
        user: req.user.id,
      });
      console.log("Restaurant has been added!");
      res.redirect("/select-restaurant");
    } catch (err) {
      console.log(err);
    }
  },

  getRestaurant: async (req, res) => {
    try {
      res.render("addrestaurant.ejs", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  selectRestaurant: async (req, res) => {
    if (req.query.filter) {
      try {
        const restaurants = await Restaurant.find({ cuisine: req.query.filter })
          .sort({ title: "asc" })
          .lean();
        const posts = await Post.find().sort({ title: "asc" }).lean();
        var users = [];
        for (i in posts) {
          var user = await User.findById(posts[i].user);
          users.push(user.userName);
        }

        let cuisine = await Restaurant.distinct("cuisine");
        console.log(cuisine);

        res.render("restaurants.ejs", {
          restaurants: restaurants,
          userName: users,
          user: req.user,
          cuisines: cuisine,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const restaurants = await Restaurant.find()
          .sort({ title: "asc" })
          .lean();
        const posts = await Post.find().sort({ title: "asc" }).lean();
        var users = [];
        for (i in posts) {
          var user = await User.findById(posts[i].user);
          users.push(user.userName);
        }

        let cuisine = await Restaurant.distinct("cuisine");
        console.log(cuisine);

        res.render("restaurants.ejs", {
          restaurants: restaurants,
          userName: users,
          user: req.user,
          cuisines: cuisine,
        });
      } catch (err) {
        console.log(err);
      }
    }
  },

  getItemDetails: async (req, res) => {
    try {
      const itemFound = await Post.findById(req.params.id);
      if (!itemFound) {
        return res.status(404).end();
      }
      return res.status(200).json(itemFound);
    } catch (error) {
      console.log(error);
    }
  },

  saveFavoriteCombo: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.user.id },
        {
          $addToSet: { favoriteCombos: req.data },
        }
      );

      console.log("Added foods to foodCombos array");
      res.redirect(`back`);
    } catch (err) {
      console.log(err);
    }
  },
};
