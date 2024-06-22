const User = require("../model/userModel.js");
const { sendOtpMail } = require("../helper/emailHelper.js");
const { generateOTP } = require("../helper/otpHelper.js");
const jwt = require("jsonwebtoken");

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

module.exports = {
  logInUser,
  verifyOTP,
};
