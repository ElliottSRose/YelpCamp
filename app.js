// Hosted app at https://desolate-sands-12100.herokuapp.com/campgrounds

var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride= require("method-override"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

// Requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),                
    indexRoutes      = require("./routes/index")                

// this still needs to be fixed, the "var url" seems to cause and error and not allow a connection
// var url = process.env.DATABASEURL // mongodb://localhost/yelp_camp_v12",{ useNewUrlParser: true });
// to set up the cloud9 env var, enter "export DATABASEURL=mongodb://localhost/yelp_camp_v12" into the terminal
// console.log(process.env.DATABASEURL); to check if DATABASEURL works
mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log("Error:", err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed database with campgrounds

// Passport Config
app.use(require("express-session")({
    secret: "Nala and Siena are the best of the best.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user,
    res.locals.error = req.flash("error"),
    res.locals.success = req.flash("success"),
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp server has started");
});

