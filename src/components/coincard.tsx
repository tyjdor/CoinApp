import React, { FC } from "react";
import { inferQueryOutput } from "../utils/trpc";
import Link from "next/link";

const CoinCard: FC<{
  coin: inferQueryOutput<"coin.getAssetInfos">[number];
}> = ({ coin }) => {
  return (
    <>
      <Link href={`/${coin.asset_id}`}>
        <section className="flex flex-col cursor-pointer justify-center h-full p-8 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
          <h2 className="text-lg hove:text-green-400 text-gray-700">
            {coin.name}
          </h2>
          <p className="text-sm text-gray-600">{coin.asset_id}</p>

          <p className="text-sm text-gray-600">
            {coin.price_usd && <>Current Price in USD {coin.price_usd}</>}
          </p>
        </section>
      </Link>
    </>
  );
};

export default CoinCard;
