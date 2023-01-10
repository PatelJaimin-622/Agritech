const express = require("express");
const {
    processPayment,
    sendStripeApiKey,
} = require("../controllers/paymentController");
const router = express.Router();
const { isAuthhenticatedUser } = require("../middleware/auth");

router.route("/payment/process").post( isAuthhenticatedUser, processPayment);

router.route("/stripeapikey").get( isAuthhenticatedUser, sendStripeApiKey);

module.exports = router;