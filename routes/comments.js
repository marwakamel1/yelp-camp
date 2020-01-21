var express = require("express"),
    router = express.Router({mergeParams:true}),
    camp =require("../models/campground"),
    comment =require("../models/comment"),
    middelware =require("../middelware");


router.get("/new",middelware.isLoggedIn,function(req,res){
camp.findById(req.params.id,function(err,finded){
   if(err){req.flash("error","something went wrong");res.redirect("back");}
  else {res.render("comments/new",{finded:finded})}
})

})

router.post("/",middelware.isLoggedIn,function(req,res){
camp.findById(req.params.id,function(err,finded){
  if (err) {req.flash("error","something went wrong");res.redirect("back");}
  else {
  	comment.create(req.body.comment,function(err,cmm){
       if(err) {req.flash("error","something went wrong");res.redirect("back");}
       else{
       	 cmm.author.id=req.user._id;
         cmm.author.username=req.user.username; 
         cmm.save();
	     finded.comments.push(cmm);
	     finded.save();
       req.flash("success","Comment Added Succesfully !")
	     res.redirect("/campgrounds/"+req.params.id)


       }

  	})

  }

})

})

//app.use("/campgrounds/:id/comments",commentRouts);


router.get("/:ic/edit",middelware.checkCommOwnership,function(req,res){
   var v = req.params.id;
   comment.findById(req.params.ic,function(err,finded){
    
      
       res.render("comments/edit",{finded:finded,v:v});

   })
     

})

router.put("/:ic",middelware.checkCommOwnership,function(req,res){
  var v = req.params.id;
  comment.findByIdAndUpdate(req.params.ic,req.body.edited,function(err,edited){
   req.flash("success","Comment updated Succesfully !")
   res.redirect("/campgrounds/"+v)

  })


})

router.delete("/:ic",middelware.checkCommOwnership,function(req,res){
	var v = req.params.id;
 comment.findByIdAndRemove(req.params.ic,function(err){
  req.flash("success","Comment deleted Succesfully !")
  res.redirect("/campgrounds/"+v)	

 })
 

})






module.exports= router;