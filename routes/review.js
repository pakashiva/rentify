const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const reviews = require("../controllers/reviews.js");

// Routes
router.post("/", isLoggedIn, validateReview, reviews.createReview);
router.delete("/:reviewId", isLoggedIn, isAuthor, reviews.deleteReview);

module.exports = router;
