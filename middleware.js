const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "you must be logged in to create listing");
        res.redirect("/login");
    }
    return next(); 
};

// module.exports.isOwner = async (req , res , next) =>{
//     let{id} = req.params;
//     let listing = await Listing.findById(id).populate('owner');

//     if (!listing.owner || !res.locals.currUser || !listing.owner._id || !res.locals.currUser._id) {
//     req.flash("error", "Invalid access: owner or user info missing.");
//     return res.redirect(`/listings/${id}`);
// }

//     if(!listing.owner._id.equals(res.locals.currUser._id)){
//         req.flash("error","You are not the owner of this listing");
//         return res.redirect(`/listings/${id}`);
//     }
//         return next();
    
// };
module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;

        let listing = await Listing.findById(id).populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (!listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }

        return next();

    } catch (err) {
        return next(err); 
    }
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
   return next();
};

module.exports.isReviewAuthor = async (req , res , next) =>{
    let{id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    return next();
}