const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listings = require("../controllers/listings.js");

// Routes
router.get("/", listings.index);
router.get("/new", isLoggedIn, listings.renderNewForm);
router.get("/:id", listings.showListing);
router.post("/", isLoggedIn, validateListing, listings.createListing);
router.get("/:id/edit", isOwner, isLoggedIn, listings.renderEditForm);
router.put("/:id", isOwner, isLoggedIn, validateListing, listings.updateListing);
router.delete("/:id", isOwner, isLoggedIn, listings.deleteListing);

module.exports = router;
