
var comment =require("../models/comment"),
	camp =require("../models/campground");

var middelware ={}

middelware. isLoggedIn=function(req,res,next){
  if(req.isAuthenticated()){ return next();}
  req.flash("error","Please Login First!")
  res.redirect("/login")
}

middelware.checkCampOwnership=function(req,res,next){
   if(req.isAuthenticated()){
      camp.findByIdAndUpdate(req.params.id,req.body.edited,function(err,finded){
        if(err){
            req.flash("error","something went wrong") 
        	res.redirect("back")}
        else {
          if (finded.author.id.equals(req.user._id)){next();}
          else {
            req.flash("error","you don't have permission to do that")
          	res.redirect("back")}
          }
        	
      })



   }
   
   else {req.flash("error","you need to be logged in to do that");
   	res.redirect("back")}

}


middelware.checkCommOwnership=function(req,res,next){
   if(req.isAuthenticated()){
        comment.findByIdAndUpdate(req.params.ic,req.body.edited,function(err,finded){
	        if(err){
                req.flash("error","something went wrong") ;
	        	res.redirect("back")}
	        else {
	           if (finded.author.id.equals(req.user._id)){next();}
	           else {
                req.flash("error","you don't have permission to do that");
	           	res.redirect("back")}
	        }
        })
    }
   
   else {
    req.flash("error","you need to be logged in to do that");
   	res.redirect("back")}
}




module.exports=middelware