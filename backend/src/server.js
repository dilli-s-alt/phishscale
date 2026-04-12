import "dotenv/config";
import app from "./app.js";

const port = process.env.PORT || 5000;
const host = process.env.HOST || "127.0.0.1";

process.on("uncaughtException", (error) => {
  console.error("[backend] uncaughtException:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("[backend] unhandledRejection:", reason);
});

process.on("exit", (code) => {
  console.log(`[backend] process exit with code ${code}`);
});

process.on("SIGTERM", () => {
  console.log("[backend] received SIGTERM");
});

process.on("SIGINT", () => {
  console.log("[backend] received SIGINT");
});

const server = app.listen(port, host, () => {
  const address = server.address();
  console.log(`Server running on http://${address.address}:${address.port}`);
});

server.on("close", () => {
  console.log("[backend] server close event fired");
});
