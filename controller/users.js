const User = require("../models/user.js");

module.exports.renderSignupForm = (req ,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signUp =  async(req,res)=>{
    try{
        let {username , email , password} = req.body;
        const newuser = new User({username , email});
        const registeredUser = await User.register(newuser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success" , "welcome to Travel with Fun!");
            res.redirect("/listings")
        })
        console.log(registeredUser);
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","welcome to Travel with Fun!");
    let redirectUrl = res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res , next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success" ,"you are logged out");
        res.redirect("/listings");
    });
}
