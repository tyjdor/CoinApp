import { createRouter } from './context';
import { z } from 'zod';
import axios from 'axios';

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

export const coinRouter = createRouter()
	.query('getAssetInfos', {
		async resolve(): Promise<Coins> {
			const res = await axios.get<Coins>(
				'https://rest-sandbox.coinapi.io/v1/assets',
				{
					headers: { 'X-CoinAPI-Key': process.env.COIN_KEY! },
				},
			);
			return res.data;
		},
	})
	.query('getAssetInfoById', {
		input: z.object({ asset_id: z.string() }),
		async resolve(req): Promise<Coins[number]> {
			const res = await axios.get<Coins>(
				`https://rest-sandbox.coinapi.io/v1/assets/${req.input.asset_id}`,
				{
					headers: { 'X-CoinAPI-Key': process.env.COIN_KEY! },
				},
			);
			return res.data[0]!;
		},
	})
	.query('getExchangeRate', {
		input: z.object({ asset_id_base: z.string() }),
		async resolve(req): Promise<Comparison> {
			const res = await axios.get<Comparison>(
				`https://rest-sandbox.coinapi.io/v1/exchangerate/${req.input.asset_id_base}`,
				{
					headers: { 'X-CoinAPI-Key': process.env.COIN_KEY! },
				},
			);
			return res.data;
		},
	});
