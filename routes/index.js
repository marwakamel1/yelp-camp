var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");



router.get("/register",function(req,res){

 res.render("register")

})


router.post("/register",function(req,res){
   
   var newUser= new User({username:req.body.username});
   User.register(newUser,req.body.password,function(err){
      if(err){
        req.flash("error",err.messege)
        return res.render("register");
      } 
      passport.authenticate("local")(req,res,function(){
      req.flash("success","Successfully Signed Up !")   
      res.redirect("/campgrounds")    
      })
  
 

   })


})

router.get("/login",function(req,res){
   
  res.render("login");
});

router.post("/login",
  passport.authenticate("local",
   {
      successRedirect:"/campgrounds",
      failureRedirect:"/login"
 
   }),function(req,res){
     


  })


router.get("/logout",function(req,res){
 req.logout();
 req.flash("success","You Logged Out !")
 res.redirect("/campgrounds");
})



module.exports= router;