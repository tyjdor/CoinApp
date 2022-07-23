import React, { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import type { UseQueryResult } from 'react-query';
import type { Comparison } from '../server/router/coin';

const coinsData: React.FC = () => {
	const router = useRouter();
	const exchangeRates = trpc.useQuery([
		'coin.getExchangeRate',
		{ asset_id_base: router.query.coin as string },
	]);
	const coin = trpc.useQuery([
		'coin.getAssetInfoById',
		{ asset_id: router.query.coin as string },
	]);
	const [selectedExchangeRate, setSelectedExchangeRate] = useState<string>();
	if (coin.data)
		return (
			<>
				<main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
					<h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
						More Coin Info
					</h1>
					<section className="flex flex-col justify-center p-6 ">
						<h2 className="text-lg hove:text-green-400 text-gray-700">
							{coin.data.name}
						</h2>
						<p className="text-sm text-gray-600">{coin.data.asset_id}</p>
						<p className="text-sm text-gray-600">
							Price in USD {coin.data.price_usd}
						</p>
						<p className="text-sm text-gray-600">
							Data Started {coin.data.data_start?.toString()}
						</p>
						<p className="text-sm text-gray-600">
							1 day volume {coin.data.volume_1day_usd}
						</p>
						<p className="text-sm text-gray-600">
							1 hour volume {coin.data.volume_1hrs_usd}
						</p>
						<div className="flex justify-center">
							<div className="mb-3 xl:w-96">
								{exchangeRates.data && (
									<select
										onChange={(e) => setSelectedExchangeRate(e.target.value)}
										className="form-select cursor-pointer appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
										aria-label="Default select example"
									>
										<option selected>Compare Assets</option>

										{exchangeRates.data.rates.map((rate) => (
											<option value={rate.asset_id_quote}>
												{rate.asset_id_quote}
											</option>
										))}
									</select>
								)}
								{selectedExchangeRate && exchangeRates?.data && (
									<p>
										Exchange Rate is{' '}
										{
											exchangeRates.data.rates.find(
												(r) => r.asset_id_quote === selectedExchangeRate,
											)!.rate
										}
									</p>
								)}
							</div>
						</div>
					</section>
				</main>
			</>
		);
	return <p>loading</p>;
};
export default coinsData;
