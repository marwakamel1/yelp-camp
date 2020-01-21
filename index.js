var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose= require("mongoose"),
	methodOverride= require("method-override"),
	comment =require("./models/comment"),
	camp =require("./models/campground"),
  User = require("./models/user"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
	seedDB =require("./seeds"),
  flash=require("connect-flash");

var indexRouts= require("./routes/index.js"),
    commentRouts= require("./routes/comments.js"),
    campgroundRouts=require("./routes/campgrounds.js");


app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(methodOverride("_method"))
app.use(flash())
app.use(require("express-session")({
   secret:"big secret",  
   resave: false,
   saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
//configuration below came from passportlocalmongooose,user model
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//
mongoose.connect("mongodb+srv://marwaKamel:1477412@cluster0-uaxfn.mongodb.net/test?retryWrites=true&w=majority",
{ useUnifiedTopology: true,useNewUrlParser: true }).then
(function(){console.log("connected to DB")}).catch
(function(err){
  console.log("error: ",err.messege)
})



mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

seedDB();
// var campgroundSchema= new mongoose.Schema({
//   name:String,
//   image:String,
//   created:{ type: Date, default: Date.now },
//   description:String
// })

// var camp =mongoose.model("camp",campgroundSchema)
app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();

})

app.use("/",indexRouts);
app.use("/campgrounds",campgroundRouts);
app.use("/campgrounds/:id/comments",commentRouts);


app.get("/",function(req,res){
  
  res.render("landing")
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))