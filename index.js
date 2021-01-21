const express=require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const { ObjectID, ObjectId } = require("bson");
const app=express();
app.use(bodyParser.urlencoded({
    extended: true
  }));
mongoose.connect("mongodb://localhost:27017/recorddb",{"useNewUrlParser":true});
const UserSchema={
    name:String,
    Age:String,
    email:String,
    PhoneNumber:String,
    Address:String
};
const User = mongoose.model("User", UserSchema);
app.route("/users")
.get(function(req,res)
{
     User.find(function(err,users)
    {
   if(users){
        const jsonItems = JSON.stringify(users);
        //console.log(jsonItems);
        res.send(jsonItems);
   }
        else
        res.send("User not found");
    });
})
.post(function(req,res)
{
const newUser=User({
    name:req.body.name,
    Age:req.body.Age,
    email:req.body.email,
    PhoneNumber:req.body.PhoneNumber,
    Address:req.body.Address

});
newUser.save(function(err){
    if (!err){
      res.send("Successfully added a new user.");
    } else {
      res.send(err);
    }
  });
})
.delete(function(req, res){
  
    User.deleteMany(function(err){
      if (!err){
        res.send("Successfully deleted all the users in recorddb.");
      } else {
        res.send(err);
      }
    });
  
  });
  app.route("/users/:id")
  .get(function(req,res)
  {
    User.findById(req.params.id, function(err, user){
        if (user){
          const jsonUser = JSON.stringify(user);
          res.send(jsonUser);
        } else {
          res.send("No user with that id found.");
        }
      });
    })
    .put(function(req,res)
    {console.log(req.params.id);
        try{
        const options={new:true};
        User.findByIdAndUpdate(req.params.id,{$set:req.body},options,  function(err, result){
            if(err){
                console.log(error);
            }
            console.log("RESULT: " + result);
        });
        console.log(req.body.name);
        }
        catch(ex){
            console.log("exception: ", ex);
        }
       
    res.send("data updated")
   })
     .patch(function(req,res)
     {
    try{
         const id=req.params.id;
       User.updateOne({_id:ObjectId(id)},
        {$set:{
            name:req.body.name,
            Age:req.body.Age,
            email:req.body.email,
             PhoneNumber:req.body.PhoneNumber,
             Address:req.body.Address
        }},
        (err)=>{
            if(err) {
                console.log(err);
            }
        }
        );
        console.log(req.body);
    }
    catch(ex){
        console.log("exception: ", ex);
    }

     })
     .delete(function(req, res){
        const id = req.params.id;
        User.findOneAndDelete({_id:ObjectId(id) }, function(err){
          if (!err){
            res.send("Successfully deleted selected data.");
          } else {
            res.send(err);
          }
        });
      });
      

  
app.listen(4000);