import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const msg = {
  to: "trainyourcompany1@gmail.com",
  from: process.env.SENDGRID_FROM_EMAIL || "trainyourcompany1@gmail.com",
  subject: "PhishScale Test",
  text: "Testing SendGrid connection",
};

sgMail.send(msg)
  .then(() => console.log("SendGrid Success"))
  .catch((err) => console.error("SendGrid Error:", err.response ? err.response.body : err.message));
