import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const getCryptoData = async (token) => {
  const options = {
    method: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${token}`,
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.CG_API_KEY,
    },
  };

  try {
    const response = await axios(options);
    const data = response.data;
    return {
      price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      holders: data.community_data.twitter_followers,
      volume: data.market_data.total_volume.usd,
      price_change_24h: data.market_data.price_change_percentage_24h,
      price_change_7d: data.market_data.price_change_percentage_7d,
    };
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return null;
  }
};

export { getCryptoData };
