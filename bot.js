import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import { connectDB, User, Alert } from "./models/db.js";
import { getCryptoData } from "./utils/crypto.js";

dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

connectDB();

bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

bot.onText(/\/register/, async (msg) => {
  const chatId = msg.chat.id;

  let user = await User.findOne({ chatId });
  if (!user) {
    user = new User({ chatId, registered: true });
    await user.save();
  }

  bot.sendMessage(chatId, "You have been registered!");
});

const isAuthenticated = async (chatId) => {
  const user = await User.findOne({ chatId });
  return user && user.registered;
};

bot.onText(/\/get_token (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match[1];

  if (!(await isAuthenticated(chatId))) {
    bot.sendMessage(chatId, "Please register first using /register.");
    return;
  }

  const data = await getCryptoData(token);
  if (data) {
    bot.sendMessage(
      chatId,
      `Price: $${data.price}\nMarket Cap: $${data.market_cap}\nHolders: ${data.holders}\n24h Volume: $${data.volume}\n24h Change: ${data.price_change_24h}%\n7d Change: ${data.price_change_7d}%`
    );
  } else {
    bot.sendMessage(chatId, "Error fetching data.");
  }
});

bot.onText(/\/set_alert (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match[1];
  const priceThreshold = parseFloat(match[2]);

  if (!(await isAuthenticated(chatId))) {
    bot.sendMessage(chatId, "Please register first using /register.");
    return;
  }

  const alertId = Date.now();
  const alert = new Alert({ chatId, token, priceThreshold, alertId });
  await alert.save();

  bot.sendMessage(chatId, `Alert set for ${token} at $${priceThreshold}`);
});

bot.onText(/\/list_alerts/, async (msg) => {
  const chatId = msg.chat.id;

  if (!(await isAuthenticated(chatId))) {
    bot.sendMessage(chatId, "Please register first using /register.");
    return;
  }

  const userAlerts = await Alert.find({ chatId });
  if (userAlerts.length === 0) {
    bot.sendMessage(chatId, "No active alerts.");
  } else {
    const alertList = userAlerts
      .map(
        (a) =>
          `ID: ${a.alertId} - Token: ${a.token} - Threshold: $${a.priceThreshold}`
      )
      .join("\n");
    bot.sendMessage(chatId, `Active alerts:\n${alertList}`);
  }
});

bot.onText(/\/remove_alert (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const alertId = parseInt(match[1]);

  if (!(await isAuthenticated(chatId))) {
    bot.sendMessage(chatId, "Please register first using /register.");
    return;
  }

  await Alert.deleteOne({ chatId, alertId });
  bot.sendMessage(chatId, `Alert with ID ${alertId} removed.`);
});

cron.schedule("* * * * *", async () => {
  // Runs every minute
  const alerts = await Alert.find({});
  for (const alert of alerts) {
    const data = await getCryptoData(alert.token);
    if (data && data.price >= alert.priceThreshold) {
      bot.sendMessage(
        alert.chatId,
        `Alert: ${alert.token} has crossed the threshold of $${alert.priceThreshold}. Current price: $${data.price}`
      );
    }
  }
});
