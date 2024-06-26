const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
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
app.listen(process.env.PORT, (port) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
