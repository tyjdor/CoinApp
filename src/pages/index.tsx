import { trpc } from "../utils/trpc";
import CoinCard from "../components/coincard";
import { useEffect, useState } from "react";

const Home = () => {
  const [search, setSearch] = useState("");
  const coins = trpc.useQuery(["coin.getAssetInfos"]);

  if (coins.data)
    return (
      <>
        <h1 className=" flex flex-col items-center leading-normal font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Coin App
        </h1>
        <div className="flex justify-center">
          <div className="mb-3 xl:w-96">
            <div className="input-group relative flex flex-wrap items-stretch w-full mb-4">
              <input
                type="search"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
              />
            </div>
          </div>
        </div>
        <section className=" mx-auto grid gap-3 text-center md:grid-cols-3 lg:w-2/3  items-center justify-center p-4">
          {coins.data
            .filter((coin) =>
              coin.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((coin, idx) => (
              <CoinCard coin={coin!} />
            ))}
        </section>
      </>
    );
};

export default Home;
