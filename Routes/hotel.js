const Hotel = require('../Models/Hotel');
const Room = require('../Models/Room')
const router = require('express').Router();
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('./verifyToken');

//create
router.post('/',verifyTokenAndAdmin,async (req,res)=>{
    const newHotel = new Hotel(req.body);
    try{
        await newHotel.save();
        return res.json(newHotel);
    }
    catch(err){
        res.json(err);
    }
})

//Update
router.put('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{new:true});
        return res.json(updatedHotel);
    }
    catch(err){
        res.json(err);
    }
})

//delete
router.delete('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try{
        await Hotel.findByIdAndDelete({_id:req.params.id});
        return res.json("Hotel has been deleted successfully.");
    }
    catch(err){
        res.json(err);
    }
})

//getAll
router.get('/', async (req, res, next) => {
    const { min, max, ...others } = req.query;
    try {
      const hotels = await Hotel.find({
        ...others,
        cheapestPrice: { $gt: min | 1, $lt: max || 999 },
      }).limit(req.query.limit);
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  });

//Get by cityCount.
router.get("/countByCity",async (req,res)=>{
    const cities = req.query.cities.split(',');
    try{
        const list = await Promise.all(cities.map(city=>{
            return Hotel.countDocuments({city:city});
        }))
        return res.json(list);
    }
    catch(err){
        return res.json(err);
    }
});

//Get by Type.
router.get("/countByType",async (req,res)=>{  
    try{
        const hotelCount = await Hotel.countDocuments({type:"Hotel"});
        const resortCount = await Hotel.countDocuments({type:"Resort"});
        const apartmentCount = await Hotel.countDocuments({type:"Apartment"});
        const villaCount = await Hotel.countDocuments({type:"Villa"});
        const cabinCount = await Hotel.countDocuments({type:"Cabins"});
        return res.json([
            {type:"Hotel",count:hotelCount},
            {type:"Resort",count:resortCount},
            {type:"Apartment",count:apartmentCount},
            {type:"Villa",count:villaCount},
            {type:"Cabin",count:cabinCount}
        ])
    }
    catch(err){
        return res.json(err);
    }
});

//get
router.get('/find/:id',async (req,res)=>{
    try{
        const hotel = await Hotel.findById({_id:req.params.id});
        return res.json(hotel);
    }
    catch(err){
        res.json(err);
    }
})

//Get Room No.
router.get("/room/:id", async (req, res, next) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      const list = await Promise.all(
        hotel.rooms.map((room) => {
          return Room.findById(room);
        })
      );
      res.status(200).json(list)
    } catch (err) {
      next(err);
    }
  });


module.exports = router;