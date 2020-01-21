var express = require("express"),
    router = express.Router(),
    camp =require("../models/campground"),
    middelware =require("../middelware");



router.get("/",function(req,res){
 camp.find({},function(err,campgrounds){
  if(err){console.log(err)}
  else { res.render("campgrounds/index",{campgrounds:campgrounds})}
 })

})

router.get("/new",middelware.isLoggedIn,function(req,res){

res.render("campgrounds/new")
})

router.post("/",middelware.isLoggedIn,function(req,res){
var name= req.body.name;
var image=req.body.image;
var price =req.body.price;
var description=req.body.description;
var author={
   id:req.user._id,
   username:req.user.username
}
console.log(author)
var newCamp= {name:name,image:image,price:price,description:description,author:author}
camp.create(newCamp,function(err,newOne){
  if(err){{req.flash("error","something went wrong");res.redirect("back");}}
  else {
   req.flash("success","Campground Added Succesfully !");
   res.redirect("/campgrounds")}
})
})

router.get("/:id",function(req,res){
camp.findById(req.params.id).populate("comments").exec(function(err,finded){
   if(err){console.log(err)}
  else {res.render("campgrounds/show",{finded:finded})}
})

})

router.get("/:id/edit",middelware.checkCampOwnership,function(req,res){
camp.findById(req.params.id,function(err,finded){
   
  res.render("campgrounds/edit",{finded:finded})
})

})

router.put("/:id",middelware.checkCampOwnership,function(req,res){
	var v = req.params.id;
camp.findByIdAndUpdate(req.params.id,req.body.edited,function(err,finded){
  req.flash("success","campground updated Succesfully") ;
  res.redirect("/campgrounds/"+v);
})

})


router.delete("/:id",middelware.checkCampOwnership,function(req,res){
camp.findByIdAndRemove(req.params.id,function(err,finded){
   req.flash("success","campground deleted Succesfully") ;  
   res.redirect("/campgrounds")
})

});



module.exports= router;