const User = require('../Models/User');
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('./verifyToken');
const router = require('express').Router();

//get User.
router.get("/:id",verifyTokenAndAdmin, async (req,res) =>{
    try{
        const user = await User.findById(req.params.id);
        const {password,isAdmin,...others} = user._doc;
        res.status(200).json(others);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//get All User
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    console.log("in getUsers");
    const users = await User.find();
    res.json(users);
  });
  
//update User
router.put('/:id',verifyTokenAndAuthorization,async (req,res) => {

    const updatedUser = {};
    
    if(req.body.username) updatedUser.username = req.body.username;
    if(req.body.email) updatedUser.email = req.body.email;
    if(req.body.password) updatedUser.password = req.body.password;
    
    try{
        const user = await User.findOne({_id:req.params.id});
        !user && res.json("User doesn't exist");
        await User.findByIdAndUpdate({_id:req.params.id},{$set:updatedUser},{new:true});
        res.json(updatedUser);
    }
    catch(err){
        res.json(err);
    }
})

//delete User
router.delete("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    try{
        const user = await User.findOne({_id:req.params.id});
        !user && res.json("User doesn't exist");
        await User.findByIdAndDelete({_id:req.params.id});
        res.json("User has been deleted Successfully");
    }
    catch(err){
        res.json(err);
    }
});

module.exports = router;