const User = require("../models/user.js");
const asyncWrap = require("../utils/asyncWrap.js"); 
const passport = require("passport");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
};

// Handle signup
module.exports.signup = asyncWrap(async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Rentify");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
};

// Handle login
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Rentify");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Handle logout
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
};
