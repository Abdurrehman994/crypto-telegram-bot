# Crypto Telegram Bot

A Telegram bot built with Node.js to fetch live cryptocurrency prices, market capitalization, number of holders, and other relevant data for specified tokens on Ethereum or Solana. The bot allows users to query specific tokens and receive real-time data updates.

## Features

- **User Authentication**: Only registered users can interact with the bot.
- **Cryptocurrency Data Retrieval**: Fetches live data from the CoinGecko API.
- **User Commands**:
  - `/register`: Register a user.
  - `/get_token <token_symbol>`: Get the latest data for the specified token.
  - `/set_alert <token_symbol> <price_threshold>`: Set price alerts.
  - `/list_alerts`: List all active alerts.
  - `/remove_alert <alert_id>`: Remove a specific alert.
- **Persistent Data Management**: Uses MongoDB to store user data, alerts, and query history.
- **Scheduled Updates**: Fetches the latest data at regular intervals and notifies users who have set alerts.

## Prerequisites

- Node.js
- MongoDB
- A Telegram bot token from [BotFather](https://core.telegram.org/bots#6-botfather)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/crypto-telegram-bot.git
    cd crypto-telegram-bot
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your Telegram bot token and MongoDB URI:

    ```env
    TELEGRAM_TOKEN=your_telegram_bot_token
    MONGO_URI=mongodb://127.0.0.1:27017/crypto-bot
    ```

4. Create a `.gitignore` file to exclude sensitive files:

    ```plaintext
    node_modules/
    .env
    ```

## Project Structure

```plaintext
crypto-telegram-bot/
├── models/
│   ├── db.js
├── utils/
│   ├── crypto.js
├── bot.js
├── .env
├── .gitignore
├── package.json
└── README.md
