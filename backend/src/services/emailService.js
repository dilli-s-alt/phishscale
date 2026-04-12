import {
  isSendgridConfigured,
  isSmtpConfigured,
  sendgridConfig,
  sgMail,
  smtpConfig,
  smtpTransporter
} from "../config/mail.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (isSendgridConfigured()) {
      const msg = {
        to,
        from: {
          email: sendgridConfig.fromEmail,
          name: sendgridConfig.fromName
        },
        subject,
        html,
        // We handle our own tracking in templateService.js, so we disable SendGrid's internal tracking
        // to prevent double-tracking and improve deliverability (local links can be flagged).
        trackingSettings: {
          clickTracking: { enable: false },
          openTracking: { enable: false }
        }
      };

      const [response] = await sgMail.send(msg);
      console.log("Email sent via SendGrid to:", to);
      console.log("SendGrid Message ID:", response.headers["x-message-id"]);
      return { status: "sent", provider: "sendgrid" };
    }

    if (isSmtpConfigured() && smtpTransporter) {
      await smtpTransporter.sendMail({
        from: `"${sendgridConfig.fromName}" <${smtpConfig.user}>`,
        to,
        subject,
        html
      });

      console.log("Email sent via SMTP to:", to);
      return { status: "sent", provider: "smtp" };
    }

    throw new Error(
      "No mail provider is configured. Add SENDGRID_API_KEY or EMAIL_USER and EMAIL_PASS."
    );
  } catch (err) {
    if (err.response) {
      console.error("SendGrid API error:", JSON.stringify(err.response.body, null, 2));
    } else {
      console.error("Email failed:", err.message);
    }

    let cleanError = err.message;
    if (err.response && err.response.body && err.response.body.errors) {
      cleanError = err.response.body.errors[0].message;
    }

    if (cleanError.includes("535-5.7.8") || cleanError.includes("Username and Password not accepted")) {
      cleanError = "Gmail authentication failed. Please ensure you are using a 16-character Google App Password (not your standard password) and have 2-Step Verification enabled.";
    }

    return {
      status: "preview_only",
      error: cleanError
    };
  }
};
