import "dotenv/config";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

export const sendgridConfig = {
  apiKey: process.env.SENDGRID_API_KEY || "",
  fromEmail: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER || "",
  fromName: process.env.SENDGRID_FROM_NAME || "IT Security"
};

if (sendgridConfig.apiKey) {
  sgMail.setApiKey(sendgridConfig.apiKey);
}

export const isSendgridConfigured = () =>
  Boolean(sendgridConfig.apiKey && sendgridConfig.fromEmail);

export { sgMail };

export const smtpConfig = {
  user: (process.env.EMAIL_USER || "").trim(),
  pass: (process.env.EMAIL_PASS || "").trim()
};

export const isSmtpConfigured = () =>
  Boolean(smtpConfig.user && smtpConfig.pass);

export const smtpTransporter = isSmtpConfigured()
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass
      }
    })
  : null;
