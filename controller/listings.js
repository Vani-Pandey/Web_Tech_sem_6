const Listing =  require("../models/listing");

module.exports.index = async (req , res)=>{                       //to show main page 1
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req , res)=>{               //form to add new listing 3
    res.render("listings/newlisting.ejs");
}

module.exports.showListing = async (req , res)=>{                                   
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({ path : "reviews",
        populate : {
            path : "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error" , "listing you requested for does not exsit");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs" , {listing});
}

module.exports.createListing = async (req , res , next) =>{  
    let url = req.file.path;
    let filename = req.file.filename;                    
    const newlisting = await new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url , filename};
    await newlisting.save();
    req.flash("success" , "New listing created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req ,res)=>{                
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "listing you requested for does not exsit");
        res.redirect("/listings");
    }
    let ImageUrl = listing.image.url;
    ImageUrl = ImageUrl.replace("/upload" , "/upload/h_200,w_250");
    res.render("listings/edit.ejs" , {listing , ImageUrl});
}

module.exports.updateListing = async (req , res)=>{                      
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file  !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename; 
    listing.image = {url , filename};
    await listing.save();
    }
    req.flash("success" , "listing updated!");
    if(!listing){
        req.flash("error" , "listing you requested for does not exsit");
        res.redirect("/listings");
    }
    res.redirect("/listings");
}

module.exports.destroyListing = async (req , res)=>{      
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "listing deleted!");
    res.redirect("/listings");
}