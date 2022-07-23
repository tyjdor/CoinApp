import { createRouter } from "./context";
import { z } from "zod";
import axios from "axios";

type Coins = {
  asset_id: string;
  name: string;
  volume_1hrs_usd: number;
  volume_1day_usd: number;
  price_usd?: number;
  data_start: Date;
}[];
export type Comparison = {
  asset_id_base: string;
  rates: {
    time: Date;
    asset_id_quote: string;
    rate: number;
  }[];
};

const makeTrue = true;
const fakeCoins = [
  {
    asset_id: "LTC",
    name: "LTC",
    type_is_crypto: 1,
    data_quote_start: "2021-11-04T16:34:29.3567180Z",
    data_quote_end: "2022-06-22T15:31:08.8760000Z",
    data_trade_start: "2021-11-04T16:34:30.9057110Z",
    data_trade_end: "2022-06-22T15:24:13.0610000Z",
    data_symbols_count: 34,
    volume_1hrs_usd: 3089734.07,
    volume_1day_usd: 40479176.18,
    volume_1mth_usd: 3944781372.24,
    price_usd: 56.20041791159888957757757971,
    data_start: "2021-11-04",
    data_end: "2022-06-22",
  },
  {
    asset_id: "BTC",
    name: "BTC",
    type_is_crypto: 1,
    data_quote_start: "2021-11-04T16:34:29.1089560Z",
    data_quote_end: "2022-06-22T15:31:02.4670000Z",
    data_trade_start: "2021-11-04T16:34:29.3367440Z",
    data_trade_end: "2022-06-22T15:27:12.4399630Z",
    data_symbols_count: 3885,
    volume_1hrs_usd: 380885958910.84,
    volume_1day_usd: 22107763808498.62,
    volume_1mth_usd: 561863970569684.07,
    price_usd: 22781.920566404702550499714749,
    data_start: "2021-11-04",
    data_end: "2022-06-22",
  },
  {
    asset_id: "ETH",
    name: "ETH",
    type_is_crypto: 1,
    data_quote_start: "2021-11-04T16:34:29.8637020Z",
    data_quote_end: "2022-06-22T15:31:02.4670000Z",
    data_trade_start: "2021-11-04T16:34:30.1457420Z",
    data_trade_end: "2022-06-22T15:25:45.4930000Z",
    data_symbols_count: 3482,
    volume_1hrs_usd: 6255766335.77,
    volume_1day_usd: 76357662750.64,
    volume_1mth_usd: 312504123080525.37,
    price_usd: 1544.8521828919406705818323266,
    data_start: "2021-11-04",
    data_end: "2022-06-22",
  },
  {
    asset_id: "USDT",
    name: "USDT",
    type_is_crypto: 1,
    data_quote_start: "2021-11-04T16:34:29.3070440Z",
    data_quote_end: "2022-06-22T15:30:58.1290000Z",
    data_trade_start: "2021-11-04T16:34:29.7931640Z",
    data_trade_end: "2022-06-22T15:27:18.8840000Z",
    data_symbols_count: 452,
    volume_1hrs_usd: 39857970211.81,
    volume_1day_usd: 305608037848.43,
    volume_1mth_usd: 313889310601376.96,
    price_usd: 1.0000719189130163405809535735,
    data_start: "2021-11-04",
    data_end: "2022-06-22",
  },
  {
    asset_id: "BNB",
    name: "BNB",
    type_is_crypto: 1,
    data_quote_start: "2021-11-04T16:34:30.6110000Z",
    data_quote_end: "2022-06-22T15:30:34.7990000Z",
    data_trade_start: "2021-11-04T16:34:30.5460000Z",
    data_trade_end: "2022-06-22T15:26:19.5180000Z",
    data_symbols_count: 18,
    volume_1hrs_usd: 0,
    volume_1day_usd: 461.31,
    volume_1mth_usd: 13316117.46,
    data_start: "2021-11-04",
    data_end: "2022-06-22",
  },
];
export const coinRouter = createRouter()
  .query("getAssetInfos", {
    async resolve(): Promise<Coins> {
      if (makeTrue) {
        const res = await axios.get<Coins>(
          "https://rest-sandbox.coinapi.io/v1/assets",
          {
            headers: { "X-CoinAPI-Key": process.env.COIN_KEY! },
          }
        );
        return res.data;
      } else {
        return fakeCoins.map((coin) => ({
          ...coin,
          data_start: new Date(coin.data_start),
        }));
      }
    },
  })
  .query("getAssetInfoById", {
    input: z.object({ asset_id: z.string() }),
    async resolve(req): Promise<Coins[number]> {
      let data;
      if (makeTrue) {
        const res = await axios.get<Coins>(
          `https://rest-sandbox.coinapi.io/v1/assets/${req.input.asset_id}`,
          {
            headers: { "X-CoinAPI-Key": process.env.COIN_KEY! },
          }
        );
        return res.data[0]!;
      } else {
        data = fakeCoins.map((coin) => ({
          ...coin,
          data_start: new Date(coin.data_start),
        }));
      }
      let coin = data.find((coin) => coin.asset_id === req.input.asset_id);
      if (!coin) throw new Error("not existing");

      return coin;
    },
  })
  .query("getExchangeRate", {
    input: z.object({ asset_id_base: z.string() }),
    async resolve(req): Promise<Comparison> {
      const res = await axios.get<Comparison>(
        `https://rest-sandbox.coinapi.io/v1/exchangerate/${req.input.asset_id_base}`,
        {
          headers: { "X-CoinAPI-Key": process.env.COIN_KEY! },
        }
      );
      return res.data;
    },
  });
