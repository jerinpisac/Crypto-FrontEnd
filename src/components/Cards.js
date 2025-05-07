import Card from "./Card";
import React from "react";
import { useState, useEffect } from "react";

function Cards(props, ref) {
  const [stocks, setStocks] = useState([]);

  const POLYGON_API_KEY = "30JTU0wZ1YTIhOTvZQ86Y_Dz0bfcct4j";
  const FINNHUB_API_KEY = "cu6d4v1r01qujm3qcms0cu6d4v1r01qujm3qcmsg";

  useEffect(() => {
    const fetchPolygonTickers = async (apiKey) => {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&sort=name&order=desc&limit=100&apiKey=${apiKey}`
      );
      const data = await response.json();
      console.log(data.results);
      return data.results || [];
    };

    const fetchFinnhubData = async (description, symbol, apiKey) => {
      try {
        const quoteResponse = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
        );
        const quote = await quoteResponse.json();

        const profileResponse = await fetch(
          `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`
        );
        const profile = await profileResponse.json();

        return {
          symbol,
          price: quote.c,
          logo: profile.logo || "",
          description,
        };
      } catch (error) {
        console.error(`Error fetching Finnhub data for ${symbol}:`, error);
        return null;
      }
    };

    const fetchStockData = async (polygonApiKey, finnhubApiKey) => {
      try {
        const polygonTickers = await fetchPolygonTickers(polygonApiKey);

        const selectedTickers = polygonTickers.slice(0, 9);

        const enrichedData = await Promise.all(
          selectedTickers.map(async (ticker) => {
            return await fetchFinnhubData(
              ticker.name,
              ticker.ticker,
              finnhubApiKey
            );
          })
        );
        console.log(enrichedData);
        return enrichedData.filter((stock) => stock !== null);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        return [];
      }
    };

    const fetchData = async () => {
      const data1 = await fetchStockData(POLYGON_API_KEY, FINNHUB_API_KEY);
      const data = data1.sort((a, b) => b.price - a.price);
      setStocks(data);
    };

    fetchData();
  }, []);

  return (
    <div ref={ref} className="cards">
      <h1>Best Stocks & Crypto</h1>
      <div className="card-slider">
        <div className="card-list">
          {stocks === null ? (
            <p>Error loading stocks. Please try again later.</p>
          ) : stocks.length > 0 ? (
            stocks.map((stock, index) => (
              <Card
                key={index}
                price={stock.price}
                ticker={stock.symbol}
                name={stock.name}
                logo={stock.logo}
                description={stock.description}
                position={index + 1}
              />
            ))
          ) : (
            <p>Loading stocks...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(Cards);
