const router = require("express").Router();

const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_API_KEY,
  key_secret: process.env.RAZOR_PAY_SEC_KEY,
});

router.get("/getapi", (req, res) => {
  res.send(process.env.RAZOR_PAY_API_KEY);
});

router.post("/checkout", async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  try {
    const order = await instance.orders.create(options);
    return res.json(order);
  } catch (err) {
    res.json(err);
  }
});

router.post("/paymentverification", async (req, res) => {
  // const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  res.redirect(
    `https://instantbook.netlify.app/paymentsuccess`
  );
  res.json({ sucess: true });
});

module.exports = router;
