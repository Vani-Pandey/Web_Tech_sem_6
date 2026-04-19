if (process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js")

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;

main()
    .then((res) =>{
        console.log("connection succesfull");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl );
}


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.static(path.join(__dirname , "public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("error in mongosession" ,err);
})

const sessionOptions={
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 *24*60*60*1000,
        httpOnly : true,
    }
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// const listings = require("./routes/listing.js");
// const reviews = require("./routes/review.js");
// const user = require("./routes/user.js");









// app.get("/" , (req , res)=>{
//     res.send("hy i am root")
// });


app.use((req ,res , next)=>{                             //flash msg
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser" ,async (req , res)=>{
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username : "versha"
//     });
//     let registeredUser = await User.register(fakeuser, "helloworld");
//     res.send(registeredUser);
// })


app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews);
app.use("/" , user)


app.all("*" , (req , res, next)=>{                        //for all eror route
    next(new ExpressError(404 , "page not found!"));
});


app.use((err , req , res , next)=>{                                               //error handlee
    let {statusCode = 500 , message = "something wrong"} = err;
    res.status(statusCode).render("error.ejs" ,{message});
    // res.status(statusCode).send(message);
});


app.listen(8080 , ()=>{
    console.log("app is listening at port 8080");
})