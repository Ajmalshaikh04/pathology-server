const nodemailer = require("nodemailer");

const sendOtpMail = (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Account created successfully",
    html: `
                      <p>Welcome to PATHOLOGY.,
                      Thank you for choosing us!
                      Your OTP is <b>${otp}</b>
                      </p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return { error: error };
    } else {
      return resp.json({ success: true, message: info.response });
    }
  });
};

const sendResetPasswordEmail = (email, resetLink) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Reset Your Password",
    html: `
      <p>Hello,</p>
      <p>You have requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = {
  sendOtpMail,
  sendResetPasswordEmail,
};
