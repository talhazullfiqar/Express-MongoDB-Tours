require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

if (!process.env.MONGODB_URI || !process.env.DB_PASSWORD) {
  console.error(
    "❌ Missing MongoDB environment variables. Check your .env file."
  );
  process.exit(1);
}

//* DATABASE CONNECTION
const databaseConnection = process.env.MONGODB_URI.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

async function connectDB() {
  try {
    const con = await mongoose.connect(databaseConnection);
    console.log(`✅ MongoDB Connected Successfully to: ${con.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

connectDB();

//! Handle MongoDB Disconnection
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB Disconnected! Attempting to reconnect...");
  connectDB();
});

//! Handle Unexpected Errors
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

app.listen(port, () => {
  console.log(`Running on PORT: ${port}`);
});
