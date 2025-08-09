const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");    //to be used in future
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");
require('dotenv').config();
const mongoStore = require("connect-mongo");
const MongoStore = require("connect-mongo");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const databaseurl = process.env.dburl;

const store = MongoStore.create({
    mongoUrl : databaseurl,
    crypto:{
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})

store.on("error",()=>{
    console.log("Error in mongo session store" , err);
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        maxAge :   7 * 24 * 60 * 60 * 1000,
    } 
};





app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser = req.user;
    next(); 
})


passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then(()=>{
    console.log("connectecd");
}).catch((err)=>{
    console.log(err);
})

async function main() {
   await mongoose.connect(databaseurl);
}


app.use("/listings",listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/",userRouter);

 
app.use((err,req,res,next)=>{
    let {statusCode=500 , message= "Some thing went Wrong!"} = err;
    res.status(statusCode).render("listing/error.ejs" , {message});
})

app.use((req, res, next) => {
    let message= "Page not found! Try again."
  res.status(404).render("listing/error.ejs" , {message});
});

app.listen(3000,()=>{
    console.log("Listnening on 3000");
})