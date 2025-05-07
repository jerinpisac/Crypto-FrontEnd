import React, { useState } from "react";

function NewsSentimentComponent() {
  const [ticker, setTicker] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const extractTickerData = async (ticker) => {
    const apiKey = "H7SY87NVYDCF4T1J";
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError(`Failed to fetch data: ${response.status}`);
        return;
      }

      const data = await response.json();
      const feed = data.feed || [];

      const results = feed
        .map((item) => {
          const tickerData = item.ticker_sentiment.find(
            (ts) => ts.ticker === ticker
          );

          if (tickerData) {
            return {
              title: item.title,
              summary: item.summary,
              url: item.url,
              relevance_score: tickerData.relevance_score,
              ticker_sentiment_score: tickerData.ticker_sentiment_score,
              ticker_sentiment_label: tickerData.ticker_sentiment_label,
            };
          }
          return null;
        })
        .filter(Boolean);

      setResults(results);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker) {
      extractTickerData(ticker);
    }
  };

  return (
    <div
      className="sentibody"
      style={{
        fontFamily: "Arial, sans-serif",
        background: "var(--bg_color)",
        // minHeight: "100vh",

      }}
    >
      <div
        style={{
          border: "2px solid var(--text_color)",
          borderRadius: "10px",
          padding: "40px",
          backgroundColor: "var(--bg_color)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "var(--text_color)",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          News Sentiment Analysis
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter ticker (e.g., BTC-USD)"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid var(--text_color)",
              width: "100%",
              maxWidth: "400px",
              marginBottom: "20px",
              background: "var(--bg_color)",
              color: "var(--text_color)"
            }}
          />
          <button
            type="submit"
            style={{
              cursor: "pointer",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              color: "#ffffff",
              backgroundColor: "#00796b",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#005b4f")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#00796b")}
          >
            Analyze
          </button>
        </form>

        {error && (
          <p style={{ color: "#d32f2f", textAlign: "center" }}>{error}</p>
        )}

        {results && results.length > 0 && (
          <div
            className="sentihead"
            style={{
              marginTop: "30px",
              backgroundColor: "var(--bg_color)",
              borderRadius: "8px",
              border: "1px solid var(--text_color)",
              textAlign: "justify"
            }}
          >
            <h3
              className="sentih3"
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "var(--text_color)",
              }}
            >
              Results for {ticker}:
            </h3>
            <ul style={{ padding: "0" }}>
              {results.map((item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "20px",
                    listStyleType: "none",
                    borderBottom: "1px solid #cfd8dc",
                    paddingBottom: "10px",
                  }}
                >
                  <a
                    className="sentilink"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#00796b",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    {item.title}
                  </a>
                  <p className="sentisum" style={{ margin: "10px 0", color: "var(--text_color)" }}>
                    {item.summary}
                  </p>
                  <p className="sentilabel" style={{ color: "var(--text_color)" }}>
                    <strong>1) Relevance Score:</strong> {item.relevance_score}
                  </p>
                  <p className="sentilabel" style={{ color: "var(--text_color)" }}>
                    <strong>2) Sentiment Score:</strong>{" "}
                    {item.ticker_sentiment_score}
                  </p>
                  <p className="sentilabel" style={{ color: "var(--text_color)" }}>
                    <strong>3) Sentiment Label:</strong>{" "}
                    {item.ticker_sentiment_label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results && results.length === 0 && (
          <p style={{ textAlign: "center", color: "#37474f" }}>
            No relevant news found for {ticker}.
          </p>
        )}
      </div>
    </div>
  );
}

export default NewsSentimentComponent;
