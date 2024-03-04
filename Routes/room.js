const Room = require('../Models/Room');
const Hotel = require('../Models/Hotel');
const router = require('express').Router();
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('./verifyToken');

//CREATE
router.post("/:hotelid", verifyTokenAndAdmin, async (req, res) => {
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);
  
    try {
      const savedRoom = await newRoom.save();
      try {
        await Hotel.findByIdAndUpdate(hotelId, {
          $push: { rooms: savedRoom._id },
        });
      } catch (err) {
        res.json(err);
      }
      res.status(200).json(savedRoom);
    } catch (err) {
      res.json(err);
    }
  });

//UPDATE
router.put("/availability/:id", async (req, res) => {
    console.log("in room unavailability");
    try {
      await Room.updateOne(
        { "roomNumbers._id": req.params.id },
        {
          $push: {
            "roomNumbers.$.unavailableDates": req.body.dates
          },
        }
      );
      res.status(200).json("Room status has been updated.");
    } catch (err) {
      res.json(err);
    }
  });

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedRoom);
    } catch (err) {
      res.json(err);
    }
  });

//DELETE
router.delete("/:id/:hotelid", verifyTokenAndAdmin, async (req, res) => {
    const hotelId = req.params.hotelid;
    try {
      await Room.findByIdAndDelete(req.params.id);
      try {
        await Hotel.findByIdAndUpdate(hotelId, {
          $pull: { rooms: req.params.id },
        });
      } catch (err) {
        res.json(err);
      }
      res.status(200).json("Room has been deleted.");
    } catch (err) {
      res.json(err);
    }
  });

//GET
router.get("/:id", async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      res.status(200).json(room);
    } catch (err) {
      res.json(err);
    }
  });

//GET ALL
router.get("/", async (req, res) => {
    try {
      const rooms = await Room.find();
      res.status(200).json(rooms);
    } catch (err) {
      res.json(err);
    }
  });

module.exports = router;