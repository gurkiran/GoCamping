var Campground  = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be signed in to do that !');
    res.redirect('/login');
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash('error',"Sorry , no campground found !");
                res.redirect('back');
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                   next();
                } else {
                     req.flash('error', 'Please do not try to trick us !');
                    res.redirect('back');
                }
               
            }
        });
    } else {
        req.flash('error', 'You do not have the permission to do that !');
        res.redirect('back');
    }
}




middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash('error', err.message);
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                   next();
                } else {
                    res.redirect('back');
                }
               
            }
        });
    } else {
       
        res.redirect('back');
    }
}

module.exports = middlewareObj;