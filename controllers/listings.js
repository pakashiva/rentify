const Listing = require("../models/listing.js");
const asyncWrap = require("../utils/asyncWrap.js");

// GET all listings
module.exports.index = asyncWrap(async (req, res) => {
    let alllists = await Listing.find({});
    res.render("listing/index.ejs", { alllists });
});

// Render new listing form
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
};

// GET single listing
module.exports.showListing = asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist. Try again");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
});

// POST new listing
module.exports.createListing = asyncWrap(async (req, res) => {
    const { listing } = req.body;
    const newListing = new Listing({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        country: listing.country,
        image: {
            url: listing.image?.url || "",
            filename: listing.image?.filename || ""
        }
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
});

// Render edit form
module.exports.renderEditForm = asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listingid = await Listing.findById(id);
    if (!listingid) {
        req.flash("error", "Listing does not exist. Try again");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listingid });
});

// PUT update listing
module.exports.updateListing = asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
});

// DELETE listing
module.exports.deleteListing = asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
});
