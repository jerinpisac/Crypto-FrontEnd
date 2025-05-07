import React, { useState, useEffect } from "react";
import NewsCard from "./NewsCard";

function CryptoNews(props, ref) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 2);
        const yesdate = yesterday.toISOString().split("T")[0];

        const response = await fetch(
          `https://newsapi.org/v2/everything?q=stocks OR crypto&from=` +
          yesdate +
          `&apiKey=e5a0c9a3968842e8a1e9441da538da5d`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNews(data.articles.slice(0, 10)); // Limit to 10 articles
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={ref} className="news-container">
      {news.map((article, index) => (
        <NewsCard
          key={index}
          title={article.title}
          description={article.description} // Added description
          image={article.urlToImage}
          url={article.url}
        />
      ))}
    </div>
  );
}

export default React.forwardRef(CryptoNews);
