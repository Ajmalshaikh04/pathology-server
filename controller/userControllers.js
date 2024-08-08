const User = require("../model/userModel.js");
const { sendOtpMail } = require("../helper/emailHelper.js");
const { generateOTP } = require("../helper/otpHelper.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const DiagnosticLab = require("../model/diagnosticLabs.js");
const Franchise = require("../model/franchise.js");
const APIFeatures = require("../helper/apifeature.js");
const Agents = require("../model/agents.js");
const Location = require("../model/location");

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
      // data: user,
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
          { _id: user._id, role: user.role },
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

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    sendOtpMail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.account;
    const user = await User.findById(userId).select("-password -otp");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.account;
//     const { name, profileImage } = req.body;

//     // Fetch the user document
//     const user = await User.findById(userId).select("-password -otp");

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     // Temporarily make the name field mutable
//     user.schema.path("name").immutable(false);

//     // Update fields
//     if (name) user.name = name;
//     if (profileImage) user.profileImage = profileImage;

//     // Save the updated user document
//     const updatedUser = await user.save();

//     // Restore the immutability of the name field
//     user.schema.path("name").immutable(true);

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       data: updatedUser,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: err.message,
//     });
//   }
// };

const updateProfile = async (req, res) => {
  try {
    const userId = req.account;
    const { name, profileImage } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (profileImage) updateData.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, select: "name email profileImage" }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

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
        $unionWith: {
          coll: "diagnosticlabs",
          pipeline: [
            { $match: { email } },
            {
              $lookup: {
                from: "locations",
                localField: "address",
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
        $unionWith: {
          coll: "agents",
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
        message:
          "Unauthorized Access: Only admins, labs, and agents are allowed.",
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
    } else if (foundAccount.role === "lab") {
      await DiagnosticLab.findByIdAndUpdate(foundAccount._id, {
        lastLogin: new Date(),
      });
    } else if (foundAccount.role === "agent") {
      await Agents.findByIdAndUpdate(foundAccount._id, {
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
    const { userId, role } = req.body; // Extract userId and role from the request body

    // Update lastLogout date based on the role
    if (role === "franchise") {
      await Franchise.findByIdAndUpdate(userId, { lastLogout: new Date() });
    } else if (role === "lab") {
      await DiagnosticLab.findByIdAndUpdate(userId, { lastLogout: new Date() });
    } else if (role === "agent") {
      await Agents.findByIdAndUpdate(userId, { lastLogout: new Date() });
    } else {
      await User.findByIdAndUpdate(userId, { lastLogout: new Date() });
    }

    return res.status(200).json({
      success: true,
      message: "Signout Successful",
    });
  } catch (err) {
    console.error("Error signing out admin:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, mobile, email, password, address, city, state, pinCode } =
      req.body;

    // Check if email or mobile number already exists
    const franchiseFound = await Franchise.findOne({
      $or: [{ email }, { mobile }],
    });

    if (franchiseFound) {
      return res.status(400).json({
        success: false,
        message: "Franchise already exists.",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create location data
    const locationData = {
      address,
      city,
      state,
      pinCode,
    };

    // Create location
    const location = await Location.create(locationData);

    // Create franchise data
    const franchiseData = {
      name,
      email,
      contactNumber: mobile,
      password: hashedPassword,
      location: location._id, // Reference to the created location
    };

    // Create franchise
    const franchise = await Franchise.create(franchiseData);

    return res.status(201).json({
      success: true,
      message: "Franchise registered successfully",
      data: {
        franchise,
        location,
      },
    });
  } catch (err) {
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

    // Check if the counselor exists and has the role of councilor
    const counselor = await User.findOne({
      _id: counselorId,
      role: "councilor",
    });
    if (!counselor) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid counselor" });
    }

    // Check if the user exists
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Assign the counselor to the user
    user.assignedCounselor = counselorId;

    // Log the user document before saving
    console.log("User before saving:", user);

    // Use save method to avoid validation issues
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

const getAllAgents = async (req, res) => {
  try {
    // Create a new instance of APIFeatures
    const features = new APIFeatures(
      Agents.find({}).populate("location"),
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
    const totalUsers = await Agents.countDocuments(features.query._conditions);

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
    console.error("Error fetching Agents:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching Agents.",
    });
  }
};

module.exports = {
  logOutUser,
  signOutAdmin,
  logInUser,
  verifyOTP,
  resendOTP,
  getProfile,
  updateProfile,
  signInAdmin,
  registerAdmin,
  getAllUsers,
  getAllCouncilors,
  getAllAgents,
  assignCounselor,
  getAllAssignedUsersByCounselorId,
};
