const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const asyncWrap = require("../utils/asyncWrap.js");

// POST new review
module.exports.createReview = asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review added!");
    res.redirect(`/listings/${id}`);
});

// DELETE review
module.exports.deleteReview = asyncWrap(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
});
