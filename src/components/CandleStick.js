import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

function CryptoCandlestickChart() {
  const [symbol, setSymbol] = useState("bitcoin");
  const [timeLength, setTimeLength] = useState(30);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
    useEffect(() => {

    const fetchCryptoData = async () => {
      const apiUrl = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=${timeLength}&x_cg_demo_api_key=CG-jnExJhB6zaJy6aSV5CzpouTq`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();

        // Process price data to calculate OHLC for each day
        const prices = data.prices;
        const ohlcData = [["Date", "Low", "Open", "Close", "High"]];
        let dailyData = [];

        prices.forEach(([timestamp, price], index) => {
          const date = new Date(timestamp).toDateString();
          if (!dailyData[date]) {
            dailyData[date] = {
              open: price,
              high: price,
              low: price,
              close: price,
            };
          } else {
            dailyData[date].high = Math.max(dailyData[date].high, price);
            dailyData[date].low = Math.min(dailyData[date].low, price);
            dailyData[date].close = price; // Set the close price to the latest price
          }
        });

        Object.keys(dailyData).forEach((date) => {
          const { open, high, low, close } = dailyData[date];
          ohlcData.push([date, low, open, close, high]);
        });

        setChartData(ohlcData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message);
      }
    };

    fetchCryptoData();
  }, [symbol, timeLength]);

  const options = {
    title: `${symbol.toUpperCase()} Price Chart - Last ${timeLength} Days`,
    legend: "none",
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: "#a52714" },
      risingColor: { strokeWidth: 0, fill: "#0f9d58" },
    },
  };

  return (
    <div className="csbody" style={{ width: "80%", margin: "0 auto", marginTop: "100px", marginBottom: "100px", textAlign: "center", color: "var(--text_color)" }}>
      <h1
      style={{
        marginBottom: "40px",
      }}
      >Cryptocurrency Price Chart</h1>

      <div className="cstext">
        <div>
          <label htmlFor="cryptoSymbol" style={{marginRight: "10px"}}>Select Cryptocurrency:</label>
          <select
            id="cryptoSymbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            style={{ 
              margin: "10px 0", 
              padding: "5px", 
              marginRight: "20px", 
              background: "var(--bg_color)",
              color: "var(--text_color)",
              border: "2px solid var(--text_color)",
              borderRadius: "10px" 
            }}
          >
            <option value="bitcoin">Bitcoin (BTC)</option>
            <option value="ethereum">Ethereum (ETH)</option>
            <option value="binancecoin">BNB (BNB)</option>
            <option value="cardano">Cardano (ADA)</option>
            <option value="solana">Solana (SOL)</option>
            <option value="ripple">XRP (XRP)</option>
            <option value="dogecoin">Dogecoin (DOGE)</option>
            <option value="polkadot">Polkadot (DOT)</option>
            <option value="uniswap">Uniswap (UNI)</option>
            <option value="chainlink">Chainlink (LINK)</option>
            <option value="litecoin">Litecoin (LTC)</option>
            <option value="tether">Tether (USDT)</option>
            <option value="monero">Monero (XMR)</option>
            <option value="eos">EOS (EOS)</option>
            <option value="tron">TRON (TRX)</option>
          </select>
        </div>
        <div>
          <label htmlFor="timeLength" style={{marginRight: "10px"}}>Select Time Length:</label>
          <select
            id="timeLength"
            value={timeLength}
            onChange={(e) => setTimeLength(parseInt(e.target.value, 10))}
            style={{ 
              margin: "10px 0", 
              padding: "5px", 
              marginRight: "20px", 
              background: "var(--bg_color)",
              color: "var(--text_color)",
              border: "2px solid var(--text_color)",
              borderRadius: "10px" 
            }}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="60">Last 60 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div id="candlestickChart" style={{ marginTop: 20 }}>
        {chartData.length > 1 ? (
          <Chart
            chartType="CandlestickChart"
            width="100%"
            height="450px"
            data={chartData}
            options={options}
          />
        ) : (
          <p>{error ? error : "Loading chart..."}</p>
        )}
      </div>
    </div>
  );
}

export default CryptoCandlestickChart;
