const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("node:crypto");
const axios = require("axios");
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

const MERCHANT_ID = "PGTESTPAYUAT77";
const SALT_INDEX = "1";
const SALT_VALUE = "14fa5465-f8a7-443f-8477-f986b8fcfde9";

const BASE_URL = "https://api-preprod.phonepe.com/apis/hermes";
const PG_PAY_ENDPOINT = "/pg/v1/pay";
const PG_STATUS_ENDPOINT = "/pg/v1/status/{merchantTransactionId}";

// Helper function to generate checksum
function generateChecksum(payload, endpoint, salt) {
  const data = payload + endpoint + salt;
  return crypto.createHash("sha256").update(data).digest("hex");
}

// Helper function to generate x-verify header
function generateXVerifyHeader(checksum, saltIndex) {
  return `${checksum}###${saltIndex}`;
}

// Endpoint to initiate a payment
// app.post("/initiatePayment", async (req, res) => {
//   const {
//     amount,
//     merchantTransactionId,
//     merchantUserId,
//     mobileNumber,
//     callbackUrl,
//   } = req.body;

//   const payloadObject = {
//     merchantId: MERCHANT_ID,
//     merchantTransactionId,
//     merchantUserId,
//     amount,
//     callbackUrl,
//     mobileNumber,
//     paymentInstrument: {
//       type: "PAY_PAGE",
//     },
//   };

//   const payload = Buffer.from(JSON.stringify(payloadObject)).toString("base64");

//   const checksum = generateChecksum(payload, PG_PAY_ENDPOINT, SALT_VALUE);
//   const xVerify = generateXVerifyHeader(checksum, SALT_INDEX);
//   console.log("payload::::", payload);
//   console.log("checksum::::", checksum);
//   console.log("xVerify::::", xVerify);

//   try {
//     const response = await axios.post(
//       `${BASE_URL}${PG_PAY_ENDPOINT}`,
//       { request: payload },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-VERIFY": xVerify,
//           "X-MERCHANT-ID": MERCHANT_ID,
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error initiating payment:", error.message);
//     res.status(500).json({ error: "Failed to initiate payment" });
//   }
// });

// // Endpoint to check payment status
// app.get("/paymentStatus/:merchantTransactionId", async (req, res) => {
//   const { merchantTransactionId } = req.params;
//   const endpoint = PG_STATUS_ENDPOINT.replace(
//     "{merchantTransactionId}",
//     merchantTransactionId
//   );
//   const payload = "";
//   console.log(endpoint);

//   const checksum = generateChecksum(payload, endpoint, SALT_VALUE);
//   const xVerify = generateXVerifyHeader(checksum, SALT_INDEX);
//   const plink = `${BASE_URL}${endpoint}`;
//   console.log(plink);

//   try {
//     const response = await axios.get(`${BASE_URL}${endpoint}`, {
//       headers: {
//         "Content-Type": "application/json",
//         "X-VERIFY": xVerify,
//         "X-MERCHANT-ID": MERCHANT_ID,
//       },
//     });
//     console.log(response);

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching payment status:", error.message);
//     res.status(500).json({ error: "Failed to fetch payment status" });
//   }
// });
// Add this new endpoint to handle payment callback
const handlePaymentCallback = async (req, res) => {
  try {
    const { merchantId, merchantTransactionId, transactionId, status } =
      req.body;

    // Verify the payment status
    if (merchantId !== process.env.MERCHANT_ID) {
      return res.status(400).json({ message: "Invalid merchant ID" });
    }

    const appointment = await Appointment.findById(merchantTransactionId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.paymentStatus = status;
    appointment.transactionId = transactionId;
    await appointment.save();

    // In a real-world scenario, you should verify the payment with PhonePe's status check API here

    res.json({ status: appointment.paymentStatus });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
};

app.post("/api/payment-callback", handlePaymentCallback);

app.listen(process.env.PORT, (port) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
