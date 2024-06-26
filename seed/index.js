// seed.js

const mongoose = require("mongoose");
const DiagnosticLab = require("../model/diagnosticLabs");
const DiagnosticTest = require("../model/diagnosticTest");
const dummyDiagnosticLabs = require("./dummy/dummyDiagnosticLabs.json");
const dummyDiagnosticTests = require("./dummy/dummyDiagnosticTests.json");

// Replace with your MongoDB connection string
const mongoURI =
  "mongodb+srv://shahzad201415:L6drIrBh0AYy97yN@cluster0.drcxrzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

db.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    // Clear existing data (optional)
    await DiagnosticLab.deleteMany({});
    await DiagnosticTest.deleteMany({});

    // Insert dummy diagnostic tests
    const createdTests = await DiagnosticTest.insertMany(dummyDiagnosticTests);
    console.log(`${createdTests.length} diagnostic tests inserted`);

    // Map test IDs for linking with labs
    const testIds = createdTests.map((test) => test._id);

    // Insert dummy diagnostic labs with linked tests
    const labsWithTests = dummyDiagnosticLabs.map((lab, index) => ({
      ...lab,
      testsOffered: index % 2 === 0 ? testIds.slice(0, 3) : testIds.slice(3, 6), // Adjust to link specific tests
    }));

    const createdLabs = await DiagnosticLab.insertMany(labsWithTests);
    console.log(`${createdLabs.length} diagnostic labs inserted`);

    console.log("Database seeding completed");

    // Close MongoDB connection
    db.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
});
