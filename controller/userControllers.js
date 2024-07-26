const User = require("../model/userModel.js");
const { sendOtpMail } = require("../helper/emailHelper.js");
const { generateOTP } = require("../helper/otpHelper.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const DiagnosticLab = require("../model/diagnosticLabs.js");
const Franchise = require("../model/franchise.js");
const APIFeatures = require("../helper/apifeature.js");

const logInUser = async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    const otp = generateOTP();

    const filter = { email: email, mobile: mobile };
    const update = {
      otp,
      lastLogin: new Date(),
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

    return res.status(200).json({
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

const logOutUser = async (req, res) => {
  try {
    const { email, mobile } = req.body;

    const user = await User.findOneAndUpdate(
      { email, mobile },
      { $set: { lastLogout: new Date() } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);
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

// const signInAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     const franchise = await Franchise.findOne({ email });

//     if (!user && !franchise) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const account = user || franchise;

//     if (account.role === "user") {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized Access: Only admins are allowed.",
//       });
//     }

//     const passwordMatch = await bcrypt.compare(password, account.password);
//     if (!passwordMatch) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid Email or Password",
//       });
//     }

//     const token = jwt.sign(
//       { _id: account._id, role: account.role },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "24h" }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Signin Successful",
//       role: account.role,
//       token: token,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// const signInAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const account = await User.aggregate([
//       { $match: { email } },
//       {
//         $unionWith: {
//           coll: "franchises",
//           pipeline: [{ $match: { email } }],
//         },
//       },
//       { $limit: 1 },
//     ]).exec();

//     if (!account || account.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const foundAccount = account[0];

//     if (foundAccount.role === "user") {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized Access: Only admins are allowed.",
//       });
//     }

//     if (!(await bcrypt.compare(password, foundAccount.password))) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid Email or Password",
//       });
//     }

//     const token = jwt.sign(
//       { _id: foundAccount._id, role: foundAccount.role },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "24h" }
//     );

//     console.log(foundAccount);
//     return res.status(200).json({
//       success: true,
//       message: "Signin Successful",
//       role: foundAccount.role,
//       location: foundAccount?.location,
//       token: token,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

const signInAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const account = await User.aggregate([
      { $match: { email } },
      {
        $unionWith: {
          coll: "franchises",
          pipeline: [
            { $match: { email } },
            {
              $lookup: {
                from: "locations",
                localField: "location",
                foreignField: "_id",
                as: "locationDetails",
              },
            },
            {
              $unwind: {
                path: "$locationDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locationDetails",
        },
      },
      {
        $unwind: { path: "$locationDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          "location.pinCode": "$locationDetails.pinCode",
        },
      },
      { $limit: 1 },
    ]).exec();

    if (!account || account.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const foundAccount = account[0];

    if (foundAccount.role === "user") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access: Only admins are allowed.",
      });
    }

    if (!(await bcrypt.compare(password, foundAccount.password))) {
      return res.status(403).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      { _id: foundAccount._id, role: foundAccount.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE_TIME }
    );

    // Update last login date
    if (foundAccount.role === "franchise") {
      await Franchise.findByIdAndUpdate(foundAccount._id, {
        lastLogin: new Date(),
      });
    } else {
      await User.findByIdAndUpdate(foundAccount._id, { lastLogin: new Date() });
    }

    return res.status(200).json({
      success: true,
      message: "Signin Successful",
      role: foundAccount.role,
      location: foundAccount.location,
      token: token,
      userId: foundAccount._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const signOutAdmin = async (req, res) => {
  try {
    const { account, role } = req;
    console.log("signOutAdmin", role, account);
    if (role === "franchise") {
      await Franchise.findByIdAndUpdate(account, { lastLogout: new Date() });
    } else {
      await User.findByIdAndUpdate(account, { lastLogout: new Date() });
    }

    return res.status(200).json({
      success: true,
      message: "Admin signed out successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

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
    // Create a new instance of APIFeatures
    const features = new APIFeatures(
      User.find({ role: "user" }).populate("assignedCounselor"),
      req.query
    )
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query
    const users = await features.query;

    // Get total count for pagination info
    const totalUsers = await User.countDocuments(features.query._conditions);

    res.status(200).json({
      success: true,
      results: users.length,
      totalUsers,
      data: users,
      pagination: {
        currentPage: features.queryString.page * 1 || 1,
        limit: features.queryString.limit * 1 || 20,
        totalPages: Math.ceil(
          totalUsers / (features.queryString.limit * 1 || 20)
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users.",
    });
  }
};
const getAllCouncilors = async (req, res) => {
  try {
    // Create a new instance of APIFeatures
    const features = new APIFeatures(
      User.find({ role: "councilor" }),
      req.query
    )
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query
    const users = await features.query;

    // Get total count for pagination info
    const totalUsers = await User.countDocuments(features.query._conditions);

    res.status(200).json({
      success: true,
      results: users.length,
      totalUsers,
      data: users,
      pagination: {
        currentPage: features.queryString.page * 1 || 1,
        limit: features.queryString.limit * 1 || 20,
        totalPages: Math.ceil(
          totalUsers / (features.queryString.limit * 1 || 20)
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users.",
    });
  }
};

const assignCounselor = async (req, res) => {
  try {
    const { userId, counselorId } = req.body;

    // Check if the counselor exists and has the role of counselor
    const counselor = await User.findById({
      _id: counselorId,
      role: "counselor",
    });
    if (!counselor) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid counselor" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Assign the counselor to the user
    user.assignedCounselor = counselorId;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Counselor assigned successfully",
      data: { userId, counselorId },
    });
  } catch (error) {
    console.error("Error assigning counselor:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllAssignedUsersByCounselorId = async (req, res) => {
  try {
    const { counselorId } = req.params;

    // Find all users assigned to the given counselor ID
    const assignedUsers = await User.find({
      assignedCounselor: counselorId,
    });

    res.status(200).json({
      success: true,
      results: assignedUsers.length,
      data: assignedUsers,
    });
  } catch (error) {
    console.error("Error fetching assigned users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching assigned users.",
    });
  }
};

module.exports = {
  logOutUser,
  signOutAdmin,
  logInUser,
  verifyOTP,
  signInAdmin,
  registerAdmin,
  getAllUsers,
  getAllCouncilors,
  assignCounselor,
  getAllAssignedUsersByCounselorId,
};
