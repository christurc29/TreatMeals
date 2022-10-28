const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get('/item-details/:id', ensureAuth, postsController.getItemDetails)
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed/:restname", ensureAuth, postsController.getRestaurantFeed);
router.get("/feed", ensureAuth, postsController.getAllFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/my-meals", ensureAuth, postsController.getMeals);
router.get("/bookmarks", ensureAuth, postsController.getBookmarks);
router.get("/addrestaurant", ensureAuth, postsController.getRestaurant);
router.get("/select-restaurant", ensureAuth, postsController.selectRestaurant);

module.exports = router;
