import { sendEmail } from "./src/services/emailService.js";
import "dotenv/config";

const testSendGrid = async () => {
  console.log("Testing SendGrid integration...");
  
  const result = await sendEmail({
    to: "trainyourcompany1@gmail.com", // testing with the same email as sender for verification
    subject: "SendGrid Test - PhishScale",
    html: "<h1>PhishScale SendGrid Test</h1><p>If you are reading this, SendGrid integration is working correctly!</p>"
  });

  if (result.status === "sent") {
    console.log("✅ Success! Email sent via", result.provider);
  } else {
    console.error("❌ Failed to send email:", result.error);
  }
};

testSendGrid().catch(console.error);
