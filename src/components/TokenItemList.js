import Link from "next/link";
import React from "react";
import Image from "next/image";
import WatchList from "./Watchlist";

const TokenItemList = ({ token, userData, columnStyles }) => {
  const tokenUrl = `coins/${token.id}`;

  const rowStyle = {
    color: "var(--text_color)",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const cellStyle = {
    padding: "0.5rem",
    verticalAlign: "middle",
    borderBottom: "1px solid var(--text_color)",
    background: "var(--bg_color)",
  };

  const stickyCellStyle = {
    ...cellStyle,
    position: "sticky",
    left: 0,
    zIndex: 1,
  };

  const imageStyle = {
    // width: "2rem",
    // height: "2rem",
    borderRadius: "50%",
    marginRight: "0.5rem",
  };

  const flexContainerStyle = {
    display: "flex",
    alignItems: "center",
  };

  const badgeStyle = (isPositive) => ({
    fontWeight: "500",
    borderRadius: "9999px",
    border: `1px solid ${isPositive ? "#4ade80" : "#f87171"}`,
    color: isPositive ? "#4ade80" : "#f87171",
    textAlign: "center",
  });

  return (
    <tr style={rowStyle}>
      <td style={{ ...cellStyle, ...columnStyles.rank }}>{token.market_cap_rank}</td>
      <td style={{ ...stickyCellStyle, ...columnStyles.name }}>
        <Link href={tokenUrl} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={flexContainerStyle}>
            <Image
              loader={() => token.image}
              unoptimized={true}
              height={32}
              width={32}
              src={token.image}
              alt={token.name}
              style={imageStyle}
              className="tokenimage"
            />
            <div>
              <p style={{ margin: "0 0 0.25rem 0", fontWeight: "500" }}>{token.name}</p>
              <p className="tokensymbol" style={{ margin: 0 }}>{token.symbol.toUpperCase()}</p>
            </div>
          </div>
        </Link>
      </td>
      <td style={{ ...cellStyle, ...columnStyles.price }}>
        ₹{token.current_price.toLocaleString("en-IN")}
      </td>
      <td style={{ ...cellStyle, ...columnStyles.percentage }}>
        <span className="badge" style={badgeStyle(token.price_change_percentage_24h > 0)}>
          {token.price_change_percentage_24h.toFixed(3)}%
        </span>
      </td>
      <td style={{ ...cellStyle, ...columnStyles.marketCap }}>
        ₹{token.market_cap.toLocaleString("en-IN")}
      </td>
      <td style={{ ...cellStyle, ...columnStyles.action }}>
        {userData ? (
          <WatchList token_id={token.id} isWatchlisted={token.iswatchlisted} />
        ) : (
          <WatchList token_id={false} isWatchlisted={token.iswatchlisted} />
        )}
      </td>
    </tr>
  );
};

export default TokenItemList;
