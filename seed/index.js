// const mongoose = require("mongoose");
// const crypto = require("node:crypto");
// const bcrypt = require("bcrypt");

// // Import your models
// const Location = require("../model/location");
// const Franchise = require("../model/franchise");
// const Agent = require("../model/agents");
// const User = require("../model/userModel");
// const DiagnosticTest = require("../model/diagnosticTest");
// const DiagnosticLab = require("../model/diagnosticLabs");
// const Appointment = require("../model/appointment");

// // Helper function to generate ticket
// const generateTicket = () => crypto.randomBytes(3).toString("hex");

// // Helper function to hash password
// const hashPassword = async (password) => {
//   const saltRounds = 10;
//   return await bcrypt.hash(password, saltRounds);
// };

// // ... (keep the existing imports and helper functions)

// const seedData = async () => {
//   const hashedPassword = await hashPassword("12345");

//   // Locations
//   const locations = [
//     {
//       _id: new mongoose.Types.ObjectId(),
//       address: "123 Main St",
//       city: "New York",
//       state: "NY",
//       pinCode: "12345",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       address: "456 Oak Ave",
//       city: "Los Angeles",
//       state: "CA",
//       pinCode: "67890",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       address: "789 Elm St",
//       city: "Chicago",
//       state: "IL",
//       pinCode: "13579",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       address: "321 Pine Rd",
//       city: "Houston",
//       state: "TX",
//       pinCode: "24680",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       address: "159 River Ln",
//       city: "Phoenix",
//       state: "AZ",
//       pinCode: "35791",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       address: "753 Hill Rd",
//       city: "Philadelphia",
//       state: "PA",
//       pinCode: "86420",
//     },
//   ];

//   // Users (including superAdmin, regular users, and counselors)
//   const users = [
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Admin User",
//       mobile: "9999999999",
//       email: "admin@example.com",
//       password: hashedPassword,
//       otp: "111111",
//       role: "superAdmin",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Alice Johnson",
//       mobile: "9988776655",
//       email: "alice@example.com",
//       password: hashedPassword,
//       otp: "123456",
//       role: "user",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Bob Williams",
//       mobile: "8877665544",
//       email: "bob@example.com",
//       password: hashedPassword,
//       otp: "654321",
//       role: "user",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Carol Brown",
//       mobile: "7766554433",
//       email: "carol@example.com",
//       password: hashedPassword,
//       otp: "987654",
//       role: "user",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "David Green",
//       mobile: "6655443322",
//       email: "david@example.com",
//       password: hashedPassword,
//       otp: "456789",
//       role: "user",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Eva White",
//       mobile: "5544332211",
//       email: "eva@example.com",
//       password: hashedPassword,
//       otp: "135790",
//       role: "user",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Frank Black",
//       mobile: "4433221100",
//       email: "frank@example.com",
//       password: hashedPassword,
//       otp: "246801",
//       role: "user",
//     },
//     // Counselors
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Grace Lee",
//       mobile: "3322110099",
//       email: "grace@example.com",
//       password: hashedPassword,
//       otp: "369258",
//       role: "councilor",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Henry Chen",
//       mobile: "2211009988",
//       email: "henry@example.com",
//       password: hashedPassword,
//       otp: "147258",
//       role: "councilor",
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Irene Wong",
//       mobile: "1100998877",
//       email: "irene@example.com",
//       password: hashedPassword,
//       otp: "258369",
//       role: "councilor",
//     },
//   ];

//   // Franchises
//   const franchises = [
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "HealthCare Express",
//       address: "101 Health St",
//       contactNumber: "1234567890",
//       email: "hce@example.com",
//       password: hashedPassword,
//       location: locations[0]._id,
//       createdBy: users[0]._id,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "MediQuick",
//       address: "202 Care Ave",
//       contactNumber: "9876543210",
//       email: "mediquick@example.com",
//       password: hashedPassword,
//       location: locations[1]._id,
//       createdBy: users[0]._id,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Swift Diagnostics",
//       address: "303 Test Blvd",
//       contactNumber: "5556667777",
//       email: "swift@example.com",
//       password: hashedPassword,
//       location: locations[2]._id,
//       createdBy: users[0]._id,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Metro Health",
//       address: "404 Metro St",
//       contactNumber: "1112223333",
//       email: "metro@example.com",
//       password: hashedPassword,
//       location: locations[3]._id,
//       createdBy: users[0]._id,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "River Valley Clinic",
//       address: "505 Valley Rd",
//       contactNumber: "4445556666",
//       email: "river@example.com",
//       password: hashedPassword,
//       location: locations[4]._id,
//       createdBy: users[0]._id,
//     },
//   ];

//   // Agents
//   const agents = [
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "John Doe",
//       email: "john@example.com",
//       contact: "1122334455",
//       location: locations[0]._id,
//       franchise: franchises[0]._id,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Jane Smith",
//       email: "jane@example.com",
//       contact: "5544332211",
//       location: locations[1]._id,
//       franchise: franchises[1]._id,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Mike Johnson",
//       email: "mike@example.com",
//       contact: "7788990011",
//       location: locations[2]._id,
//       franchise: franchises[2]._id,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Sarah Brown",
//       email: "sarah@example.com",
//       contact: "3344556677",
//       location: locations[3]._id,
//       franchise: franchises[3]._id,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Chris Lee",
//       email: "chris@example.com",
//       contact: "9900112233",
//       location: locations[4]._id,
//       franchise: franchises[4]._id,
//     },
//   ];

//   // Diagnostic Tests
//   const diagnosticTests = [
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Complete Blood Count",
//       description: "Measures various components of the blood",
//       price: 50,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Lipid Profile",
//       description: "Measures cholesterol and triglycerides",
//       price: 75,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Thyroid Function Test",
//       description: "Measures thyroid hormone levels",
//       price: 100,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Chest X-Ray",
//       description: "Imaging of the chest area",
//       price: 150,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Urinalysis",
//       description: "Analysis of urine composition",
//       price: 40,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Electrocardiogram (ECG)",
//       description: "Recording of heart's electrical activity",
//       price: 120,
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       name: "Hemoglobin A1C",
//       description: "Measures average blood sugar levels",
//       price: 80,
//     },
//   ];

//   // Diagnostic Labs
//   const diagnosticLabs = [
//     {
//       _id: new mongoose.Types.ObjectId(),
//       userId: users[1]._id,
//       name: "City Central Lab",
//       address: locations[0]._id,
//       contactNumber: "1112223333",
//       testsOffered: [
//         diagnosticTests[0]._id,
//         diagnosticTests[1]._id,
//         diagnosticTests[2]._id,
//       ],
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       userId: users[2]._id,
//       name: "Quick Diagnostics",
//       address: locations[1]._id,
//       contactNumber: "4445556666",
//       testsOffered: [
//         diagnosticTests[0]._id,
//         diagnosticTests[3]._id,
//         diagnosticTests[4]._id,
//       ],
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       userId: users[3]._id,
//       name: "HealthScan Center",
//       address: locations[2]._id,
//       contactNumber: "7778889999",
//       testsOffered: [
//         diagnosticTests[1]._id,
//         diagnosticTests[2]._id,
//         diagnosticTests[5]._id,
//       ],
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       userId: users[4]._id,
//       name: "Metro Medical Lab",
//       address: locations[3]._id,
//       contactNumber: "2223334444",
//       testsOffered: [
//         diagnosticTests[3]._id,
//         diagnosticTests[4]._id,
//         diagnosticTests[6]._id,
//       ],
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       userId: users[5]._id,
//       name: "River Valley Diagnostics",
//       address: locations[4]._id,
//       contactNumber: "5556667777",
//       testsOffered: [
//         diagnosticTests[0]._id,
//         diagnosticTests[2]._id,
//         diagnosticTests[5]._id,
//       ],
//     },
//   ];

//   // Appointments
//   const appointments = [
//     {
//       _id: new mongoose.Types.ObjectId(),
//       type: "Lab Test",
//       age: 30,
//       gender: "Female",
//       problem: "Routine Checkup",
//       problemDescription: "Annual health screening",
//       user: users[1]._id,
//       labs: {
//         lab: diagnosticLabs[0]._id,
//         tests: [
//           { test: diagnosticTests[0]._id, status: "Pending" },
//           { test: diagnosticTests[1]._id, status: "Pending" },
//         ],
//       },
//       status: "Pending",
//       appointmentDate: new Date("2024-08-01"),
//       ticket: generateTicket(),
//       createdBy: agents[0]._id,
//       createdByModel: "Agent",
//       assignedCounselor: users[7]._id, // Grace Lee
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       type: "Consultation",
//       age: 45,
//       gender: "Male",
//       problem: "Persistent Cough",
//       problemDescription: "Coughing for 2 weeks",
//       user: users[2]._id,
//       labs: {
//         lab: diagnosticLabs[1]._id,
//         tests: [{ test: diagnosticTests[3]._id, status: "Pending" }],
//       },
//       status: "Approve",
//       appointmentDate: new Date("2024-07-25"),
//       ticket: generateTicket(),
//       createdBy: users[2]._id,
//       createdByModel: "User",
//       assignedCounselor: users[8]._id, // Henry Chen
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       type: "Lab Test",
//       age: 55,
//       gender: "Female",
//       problem: "Thyroid Check",
//       problemDescription: "Feeling fatigued and gaining weight",
//       user: users[3]._id,
//       labs: {
//         lab: diagnosticLabs[2]._id,
//         tests: [{ test: diagnosticTests[2]._id, status: "In Progress" }],
//       },
//       status: "Approve",
//       appointmentDate: new Date("2024-07-30"),
//       ticket: generateTicket(),
//       createdBy: agents[2]._id,
//       createdByModel: "Agent",
//       assignedCounselor: users[9]._id, // Irene Wong
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       type: "Lab Test",
//       age: 35,
//       gender: "Male",
//       problem: "Diabetes Screening",
//       problemDescription: "Family history of diabetes",
//       user: users[4]._id,
//       labs: {
//         lab: diagnosticLabs[3]._id,
//         tests: [{ test: diagnosticTests[6]._id, status: "Pending" }],
//       },
//       status: "Pending",
//       appointmentDate: new Date("2024-08-05"),
//       ticket: generateTicket(),
//       createdBy: agents[3]._id,
//       createdByModel: "Agent",
//       assignedCounselor: users[7]._id, // Grace Lee
//     },
//     {
//       _id: new mongoose.Types.ObjectId(),
//       type: "Consultation",
//       age: 60,
//       gender: "Male",
//       problem: "Heart Palpitations",
//       problemDescription: "Experiencing rapid heartbeat",
//       user: users[5]._id,
//       labs: {
//         lab: diagnosticLabs[4]._id,
//         tests: [{ test: diagnosticTests[5]._id, status: "Pending" }],
//       },
//       status: "Approve",
//       appointmentDate: new Date("2024-08-10"),
//       ticket: generateTicket(),
//       createdBy: users[5]._id,
//       createdByModel: "User",
//       assignedCounselor: users[8]._id, // Henry Chen
//     },
//   ];

//   try {
//     // Clear existing data
//     await Location.deleteMany({});
//     await Franchise.deleteMany({});
//     await Agent.deleteMany({});
//     await User.deleteMany({});
//     await DiagnosticTest.deleteMany({});
//     await DiagnosticLab.deleteMany({});
//     await Appointment.deleteMany({});

//     // Insert new data
//     await Location.insertMany(locations);
//     await User.insertMany(users);
//     await Franchise.insertMany(franchises);
//     await Agent.insertMany(agents);
//     await DiagnosticTest.insertMany(diagnosticTests);
//     await DiagnosticLab.insertMany(diagnosticLabs);
//     await Appointment.insertMany(appointments);

//     console.log("Database seeded successfully");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   }
// };

// // ... (keep the existing MongoDB connection and execution code)

// // Connect to MongoDB and run the seed function
// mongoose
//   .connect(
//     "mongodb+srv://shahzad201415:L6drIrBh0AYy97yN@cluster0.drcxrzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//   )
//   .then(() => {
//     console.log("Connected to MongoDB");
//     return seedData();
//   })
//   .then(() => {
//     console.log("Seeding completed");
//     mongoose.connection.close();
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//     mongoose.connection.close();
//   });
//====================================================
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Location = require("../model/location");
const Franchise = require("../model/franchise");
const Agent = require("../model/agents");
const User = require("../model/userModel");
const DiagnosticTest = require("../model/diagnosticTest");
const DiagnosticLab = require("../model/diagnosticLabs");
const Appointment = require("../model/appointment");
const crypto = require("node:crypto");

const generateTicket = () => crypto.randomBytes(3).toString("hex");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const seedData = async () => {
  const hashedPassword = await hashPassword("12345");

  const locations = [
    {
      _id: new mongoose.Types.ObjectId(),
      address: "123 Main St",
      city: "New York",
      state: "NY",
      pinCode: "12345",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      pinCode: "67890",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      address: "789 Elm St",
      city: "Chicago",
      state: "IL",
      pinCode: "13579",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      address: "321 Pine Rd",
      city: "Houston",
      state: "TX",
      pinCode: "24680",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      address: "159 River Ln",
      city: "Phoenix",
      state: "AZ",
      pinCode: "35791",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      address: "753 Hill Rd",
      city: "Philadelphia",
      state: "PA",
      pinCode: "86420",
    },
  ];

  const users = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Admin User",
      mobile: "9999999999",
      email: "admin@example.com",
      password: hashedPassword,
      otp: "111111",
      role: "superAdmin",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Alice Johnson",
      mobile: "9988776655",
      email: "alice@example.com",
      password: hashedPassword,
      otp: "123456",
      role: "user",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Bob Williams",
      mobile: "8877665544",
      email: "bob@example.com",
      password: hashedPassword,
      otp: "654321",
      role: "user",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Carol Brown",
      mobile: "7766554433",
      email: "carol@example.com",
      password: hashedPassword,
      otp: "987654",
      role: "user",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "David Green",
      mobile: "6655443322",
      email: "david@example.com",
      password: hashedPassword,
      otp: "456789",
      role: "user",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Eva White",
      mobile: "5544332211",
      email: "eva@example.com",
      password: hashedPassword,
      otp: "135790",
      role: "user",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Frank Black",
      mobile: "4433221100",
      email: "frank@example.com",
      password: hashedPassword,
      otp: "246801",
      role: "user",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Grace Lee",
      mobile: "3322110099",
      email: "grace@example.com",
      password: hashedPassword,
      otp: "369258",
      role: "councilor",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Henry Chen",
      mobile: "2211009988",
      email: "henry@example.com",
      password: hashedPassword,
      otp: "147258",
      role: "councilor",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Irene Wong",
      mobile: "1100998877",
      email: "irene@example.com",
      password: hashedPassword,
      otp: "258369",
      role: "councilor",
    },
  ];

  const franchises = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: "HealthCare Express",
      address: "101 Health St",
      contactNumber: "1234567890",
      email: "hce@example.com",
      password: hashedPassword,
      location: locations[0]._id,
      createdBy: users[0]._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "MediQuick",
      address: "202 Care Ave",
      contactNumber: "9876543210",
      email: "mediquick@example.com",
      password: hashedPassword,
      location: locations[1]._id,
      createdBy: users[0]._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Swift Diagnostics",
      address: "303 Test Blvd",
      contactNumber: "5556667777",
      email: "swift@example.com",
      password: hashedPassword,
      location: locations[2]._id,
      createdBy: users[0]._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Metro Health",
      address: "404 Metro St",
      contactNumber: "1112223333",
      email: "metro@example.com",
      password: hashedPassword,
      location: locations[3]._id,
      createdBy: users[0]._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "River Valley Clinic",
      address: "505 Valley Rd",
      contactNumber: "4445556666",
      email: "river@example.com",
      password: hashedPassword,
      location: locations[4]._id,
      createdBy: users[0]._id,
    },
  ];

  const agents = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: "John Doe",
      email: "john@example.com",
      contact: "1122334455",
      location: locations[0]._id,
      franchise: franchises[0]._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Jane Smith",
      email: "jane@example.com",
      contact: "5544332211",
      location: locations[1]._id,
      franchise: franchises[1]._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Mike Johnson",
      email: "mike@example.com",
      contact: "7788990011",
      location: locations[2]._id,
      franchise: franchises[2]._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Sarah Brown",
      email: "sarah@example.com",
      contact: "3344556677",
      location: locations[3]._id,
      franchise: franchises[3]._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Chris Lee",
      email: "chris@example.com",
      contact: "9900112233",
      location: locations[4]._id,
      franchise: franchises[4]._id,
    },
  ];

  const diagnosticTests = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Complete Blood Count",
      description: "Measures various components of the blood",
      price: 50,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Lipid Profile",
      description: "Measures cholesterol and triglycerides",
      price: 75,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Thyroid Function Test",
      description: "Measures thyroid hormone levels",
      price: 100,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Chest X-Ray",
      description: "Imaging of the chest area",
      price: 150,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Urinalysis",
      description: "Analysis of urine composition",
      price: 40,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Electrocardiogram (ECG)",
      description: "Recording of heart's electrical activity",
      price: 120,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Hemoglobin A1C",
      description: "Measures average blood sugar levels",
      price: 80,
    },
  ];

  const diagnosticLabs = [
    {
      _id: new mongoose.Types.ObjectId(),
      userId: users[1]._id,
      name: "City Central Lab",
      address: locations[0]._id,
      contactNumber: "1112223333",
      testsOffered: [
        diagnosticTests[0]._id,
        diagnosticTests[1]._id,
        diagnosticTests[2]._id,
      ],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: users[2]._id,
      name: "Downtown Diagnostics",
      address: locations[1]._id,
      contactNumber: "2223334444",
      testsOffered: [
        diagnosticTests[3]._id,
        diagnosticTests[4]._id,
        diagnosticTests[5]._id,
      ],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: users[3]._id,
      name: "HealthFirst Lab",
      address: locations[2]._id,
      contactNumber: "3334445555",
      testsOffered: [
        diagnosticTests[1]._id,
        diagnosticTests[2]._id,
        diagnosticTests[6]._id,
      ],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: users[4]._id,
      name: "Precision Diagnostics",
      address: locations[3]._id,
      contactNumber: "4445556666",
      testsOffered: [
        diagnosticTests[0]._id,
        diagnosticTests[3]._id,
        diagnosticTests[4]._id,
      ],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: users[5]._id,
      name: "RapidResults Lab",
      address: locations[4]._id,
      contactNumber: "5556667777",
      testsOffered: [
        diagnosticTests[2]._id,
        diagnosticTests[5]._id,
        diagnosticTests[6]._id,
      ],
    },
  ];

  const appointments = [
    {
      _id: new mongoose.Types.ObjectId(),
      type: "Lab Test",
      age: 30,
      gender: "Female",
      problem: "Routine Checkup",
      problemDescription: "Annual health screening",
      referral: agents[0]._id,
      labs: {
        lab: diagnosticLabs[0]._id,
        tests: [
          { test: diagnosticTests[0]._id, status: "Pending" },
          { test: diagnosticTests[1]._id, status: "Pending" },
        ],
      },
      status: "Pending",
      appointmentDate: new Date("2024-08-01"),
      ticket: generateTicket(),
      createdBy: users[1]._id,
      createdByModel: "User",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      type: "Lab Test",
      age: 45,
      gender: "Male",
      problem: "Chest Pain",
      problemDescription: "Intermittent chest pain",
      referral: agents[1]._id,
      labs: {
        lab: diagnosticLabs[1]._id,
        tests: [
          { test: diagnosticTests[3]._id, status: "Pending" },
          { test: diagnosticTests[4]._id, status: "Pending" },
        ],
      },
      status: "Pending",
      appointmentDate: new Date("2024-08-02"),
      ticket: generateTicket(),
      createdBy: agents[1]._id,
      createdByModel: "Agent",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      type: "Lab Test",
      age: 60,
      gender: "Female",
      problem: "Diabetes Management",
      problemDescription: "Monitoring blood sugar levels",
      referral: agents[2]._id,
      labs: {
        lab: diagnosticLabs[2]._id,
        tests: [
          { test: diagnosticTests[6]._id, status: "Pending" },
          { test: diagnosticTests[5]._id, status: "Pending" },
        ],
      },
      status: "Pending",
      appointmentDate: new Date("2024-08-03"),
      ticket: generateTicket(),
      createdBy: users[2]._id,
      createdByModel: "User",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      type: "Lab Test",
      age: 50,
      gender: "Male",
      problem: "Thyroid Checkup",
      problemDescription: "Routine thyroid function test",
      referral: agents[3]._id,
      labs: {
        lab: diagnosticLabs[3]._id,
        tests: [
          { test: diagnosticTests[2]._id, status: "Pending" },
          { test: diagnosticTests[0]._id, status: "Pending" },
        ],
      },
      status: "Pending",
      appointmentDate: new Date("2024-08-04"),
      ticket: generateTicket(),
      createdBy: agents[3]._id,
      createdByModel: "Agent",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      type: "Lab Test",
      age: 35,
      gender: "Female",
      problem: "Heart Health Checkup",
      problemDescription: "Routine ECG and blood test",
      referral: agents[4]._id,
      labs: {
        lab: diagnosticLabs[4]._id,
        tests: [
          { test: diagnosticTests[5]._id, status: "Pending" },
          { test: diagnosticTests[1]._id, status: "Pending" },
        ],
      },
      status: "Pending",
      appointmentDate: new Date("2024-08-05"),
      ticket: generateTicket(),
      createdBy: users[3]._id,
      createdByModel: "User",
    },
  ];
  try {
    await Location.deleteMany({});
    await Franchise.deleteMany({});
    await Agent.deleteMany({});
    await User.deleteMany({});
    await DiagnosticTest.deleteMany({});
    await DiagnosticLab.deleteMany({});
    await Appointment.deleteMany({});

    await Location.insertMany(locations);
    await User.insertMany(users);
    await Franchise.insertMany(franchises);
    await Agent.insertMany(agents);
    await DiagnosticTest.insertMany(diagnosticTests);
    await DiagnosticLab.insertMany(diagnosticLabs);
    await Appointment.insertMany(appointments);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

mongoose
  .connect(
    "mongodb+srv://shahzad201415:L6drIrBh0AYy97yN@cluster0.drcxrzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    return seedData();
  })
  .then(() => {
    console.log("Seeding completed");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error:", error);
    mongoose.connection.close();
  });
