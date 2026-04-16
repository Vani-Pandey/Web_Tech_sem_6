const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controller/listings.js")
const multer  = require('multer');
const {storage}  = require("../CloudConfig.js");
const upload = multer({ storage });


//validation middleware
const validateListing = (req ,res , next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404 , errmsg);
    }else{
        next();
    }
};


router
    .route("/")
    .get(wrapAsync(listingController.index))           //sshow main page
    .post(                                   //create route add that new form details in Listings 4
    isLoggedIn,            
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.createListing));

//add new route
router.get("/new" , isLoggedIn , listingController.renderNewForm );             //form to add new listing

router
    .route("/:id")
    .get( wrapAsync (listingController.showListing))              //show route
    .put(                                                                //update route 
    isLoggedIn , 
    isOwner,
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync (listingController.updateListing))
    .delete( isLoggedIn , isOwner, wrapAsync (listingController.destroyListing));   //delete route



//edit form route                                                                   //form to edit the listing 5
router.get("/:id/edit" , 
    isLoggedIn ,
    isOwner,
    wrapAsync(listingController.renderEditForm));




module.exports = router;