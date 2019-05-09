var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                }  else {
                // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                    if (!foundCampground) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    } 
                    // does the user own the campground?
                    if(foundCampground.author.id.equals(req.user._id)) {
                         next();
                    } else {
                         req.flash("error", "You don't have permission to do that");
                         res.redirect("back");
                    }
                }
            });
    } else {
        res.redirect("back");

    }
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                } else {
                    // does the user own the comment?
                    if(foundComment.author.id.equals(req.user._id)) {
                         next();
                    } else {
                         res.redirect("back");
                    }
                }
            });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");

    }
}


middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj