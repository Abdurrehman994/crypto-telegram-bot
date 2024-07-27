import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crypto-bot", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

const userSchema = new mongoose.Schema({
  chatId: String,
  registered: Boolean,
});

const alertSchema = new mongoose.Schema({
  chatId: String,
  token: String,
  priceThreshold: Number,
  alertId: Number,
});

const User = mongoose.model("User", userSchema);
const Alert = mongoose.model("Alert", alertSchema);

export { connectDB, User, Alert };
