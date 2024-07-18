// const mongoose = require("mongoose");
// const { faker } = require("@faker-js/faker");
// const User = require("../model/userModel"); // Adjust the path as necessary

// mongoose
//   .connect(
//     "mongodb+srv://shahzad201415:L6drIrBh0AYy97yN@cluster0.drcxrzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//   )
//   .then(() => console.log("MongoDB connected..."))
//   .catch((err) => console.log(err));

// const generateDummyUsers = async () => {
//   const users = [];

//   for (let i = 0; i < 10; i++) {
//     const user = new User({
//       name: faker.person.fullName(),
//       mobile: faker.phone.number(),
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//       otp: faker.string.numeric(6),
//       role: "user",
//       adminDetails: {},
//       lastLogin: faker.date.recent(),
//       lastLogout: faker.date.recent(),
//     });

//     users.push(user);
//   }

//   try {
//     await User.insertMany(users);
//     console.log("10 dummy users inserted");
//   } catch (err) {
//     console.log("Error inserting dummy users:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// generateDummyUsers();
//===================================================
const mongoose = require("mongoose");
const crypto = require("node:crypto");
const Appointment = require("../model/appointment");

const generateTicket = () => crypto.randomBytes(3).toString("hex"); // Generates a unique ticket

async function seedAppointments() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://shahzad201415:L6drIrBh0AYy97yN@cluster0.drcxrzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    // Fetch all appointments
    const appointments = await Appointment.find({});

    // Update each appointment with a new ticket
    for (const appointment of appointments) {
      await Appointment.findByIdAndUpdate(
        appointment._id,
        { ticket: generateTicket() }, // Set a new ticket
        { new: true } // Return the updated document
      );
    }

    console.log("All appointment tickets updated successfully.");

    // Disconnect from MongoDB
    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to update appointment tickets:", error);
    throw error; // Throw error for logging or handling further up in the chain
  }
}

seedAppointments()
  .then(() => {
    console.log("Seed operation completed.");
    process.exit(0); // Exit with success
  })
  .catch((error) => {
    console.error("Seed operation failed:", error);
    process.exit(1); // Exit with error
  });
