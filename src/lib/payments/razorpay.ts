import Razorpay from "razorpay";

const razorpayKeyId = process.env.RAZORPAY_KEY || "rzp_test_dummy";
const razorpayKeySecret = process.env.RAZORPAY_SECRET || "dummy_secret";

export const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});
