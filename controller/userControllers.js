const User = require("../model/userModel.js");
const { sendOtpMail } = require("../helper/emailHelper.js");
const { generateOTP } = require("../helper/otpHelper.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const DiagnosticLab = require("../model/diagnosticLabs.js");

const logInUser = async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    const otp = generateOTP();

    const filter = { email: email, mobile: mobile };
    const update = {
      otp,
    };

    const user = await User.findOneAndUpdate(
      filter,
      { $set: update, $setOnInsert: { name: name } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    sendOtpMail(email, otp);

    return res.status(201).json({
      success: true,
      message: "OTP sent successfully",
      data: user,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      if (user.otp === otp) {
        const token = await jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: process.env.JWT_EXPIRE_TIME,
          }
        );

        return res.status(201).json({
          token,
          success: true,
          message: "Login successfully",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid OTP",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "NO User found",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const signInAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (passwordMatch) {
      if (userData.role === "admin" || userData.role === "superAdmin") {
        const token = jwt.sign(
          { _id: userData._id, role: userData.role },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "24h",
          }
        );

        return res.status(200).json({
          success: true,
          message: "Signin Successful",
          token: token,
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "Unauthorized Access",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// const registerAdmin = async (req, res) => {
//   try {
//     const { name, mobile, email, password } = req.body;

//     // Check if email or mobile number already exists
//     const userFound = await User.findOne({
//       $or: [{ email }, { mobile }],
//     });

//     if (userFound) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists.",
//       });
//     }

//     const otp = generateOTP();

//     const saltRounds = 10;
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const userData = {
//       name,
//       mobile,
//       email,
//       password: hashedPassword,
//       otp,
//       role: "admin",
//     };

//     const user = await User.create(userData);
//     // sendOtpMail(email, otp);

//     return res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: user,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

const registerAdmin = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, mobile, email, password, labAddress } = req.body;

    // Check if email or mobile number already exists
    const userFound = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (userFound) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const otp = generateOTP();

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      mobile, // mobile for both user and lab contact number
      email,
      password: hashedPassword,
      otp,
      role: "admin",
    };

    const user = await User.create([userData], { session });
    const userId = user[0]._id; // Assuming the user is stored in the first element of the array

    // Create the lab using the registered user's ID
    const labData = {
      name, // same name as user
      address: labAddress,
      contactNumber: mobile, // same mobile as user
      userId: userId,
    };

    const lab = await DiagnosticLab.create([labData], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "User and lab created successfully",
      data: {
        user: user[0],
        lab: lab[0],
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users.",
    });
  }
};

module.exports = {
  logInUser,
  verifyOTP,
  signInAdmin,
  registerAdmin,
  getAllUsers,
};
