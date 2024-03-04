const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongoDb connected successfully"))
  .catch((err) => console.log(err));

const authRoute = require("./Routes/auth");
const userRoute = require("./Routes/user");
const hotelRoute = require("./Routes/hotel");
const roomRoute = require("./Routes/room");
const checkoutRoute = require("./Routes/checkout");
app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/hotel",hotelRoute);
app.use("/api/room",roomRoute);
app.use("/api",checkoutRoute);

app.listen(process.env.PORT, () => {
  console.log("Working at port no. 5000");
});

