import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER.trim(),
    pass: process.env.EMAIL_PASS.trim()
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Verify error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
