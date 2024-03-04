const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) => {
    const token = req.headers.token;
    if(!token) res.json("You are not autheticated");
    jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
        if(err) res.json(err);
        req.user = user;
        next();
    })
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log(req.user);
        if (req.user._id === req.params.id || req.user.isAdmin) {
        next();
        } else {
        res.status(403).json("You are not alowed to do that!");
        }
    });
    };
  
  const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };
  
  module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  };