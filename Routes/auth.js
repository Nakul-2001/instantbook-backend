const router = require("express").Router();
const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");

//Register
router.post("/register", async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(req.body.password, process.env.SEC),
    });

    await newUser.save();
    res.send(newUser);
  } catch (err) {
    res.send(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  !user && res.send("You are not registerd User");

  const originalPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.SEC
  ).toString(CryptoJS.enc.Utf8);

  originalPassword !== req.body.password && res.send("Wrong Credentials");

  const accessToken = jwt.sign(
    {
      id:user._id,
      isAdmin:user.isAdmin
    },
    process.env.JWT_SEC
  );

  const { password,isAdmin, ...other } = user._doc;
  res.json({ ...other, accessToken });
});

module.exports = router;
