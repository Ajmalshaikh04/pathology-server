const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("node:crypto");
const axios = require("axios");
const Appointment = require("./model/appointment");
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
mongoose.set("strictQuery", false);
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Working Tree");
});
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("connection failed", err);
  });

app.use(require("./routes/booking"));
app.use(require("./routes/userRoutes"));
app.use(require("./routes/diagnosticLabRoutes"));
app.use(require("./routes/labCategoriesRoutes"));
app.use(require("./routes/franchiseRoutes"));
app.use(require("./routes/agentsRoutes"));
app.use(require("./routes/appointmentRoutes"));
app.use(require("./routes/reportRoutes"));
app.use(require("./routes/labBoyRoutes"));
app.use(require("./routes/healthProblemRoutes"));

const handlePaymentCallback = async (req, res) => {
  try {
    const { merchantId, merchantTransactionId, transactionId } = req.body;

    console.log("Received payment callback:", req.body);

    // Verify the payment status
    if (merchantId !== process.env.MERCHANT_ID) {
      console.error("Invalid merchant ID:", merchantId);
      return res.status(400).json({ message: "Invalid merchant ID" });
    }

    const appointment = await Appointment.findById(merchantTransactionId);
    if (!appointment) {
      console.error("Appointment not found:", merchantTransactionId);
      return res.status(404).json({ message: "Appointment not found" });
    }

    const convertedId = `MID${merchantTransactionId}`;

    // Check payment status with PhonePe's status check API
    const checkStatusResponse = await checkPaymentStatus(
      merchantId,
      convertedId
    );

    if (checkStatusResponse.success) {
      appointment.paymentStatus = checkStatusResponse.code;
      appointment.transactionId = transactionId;
      await appointment.save();

      res.json({ status: appointment.paymentStatus });
    } else {
      console.error("Payment verification failed:", checkStatusResponse);
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error processing payment callback:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
};

const checkPaymentStatus = async (merchantId, merchantTransactionId) => {
  const saltKey = process.env.SALT_KEY;
  const saltIndex = process.env.SALT_INDEX;

  // Construct the API endpoint for checking payment status
  const endpoint = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;

  // Correct the string format to match PhonePe's requirement
  const stringToHash = `${endpoint}${saltKey}`;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const xVerify = `${sha256}###${saltIndex}`;

  try {
    // Make a GET request to the PhonePe API
    const response = await axios.get(
      `https://api-preprod.phonepe.com/apis/pg-sandbox${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": merchantId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error checking payment status:",
      error.response?.data || error.message
    );
    throw new Error("Failed to check payment status with PhonePe");
  }
};

// Define the payment callback route
app.post("/api/payment-callback", handlePaymentCallback);

app.listen(process.env.PORT, (port) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
