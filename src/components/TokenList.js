import React, { useContext } from "react";
import UserContext from "../context/userContext";
import TokenItemList from "./TokenItemList";
import TokenContext from "../context/tokenContext";

const TokenList = ({ tokenList, watchlisted }) => {
  const { userData } = useContext(UserContext);
  const { tokens } = useContext(TokenContext);

  const containerStyle = {
    maxWidth: "1120px",
    margin: "1rem auto",
    padding: "0 1rem",
  };

  const tableContainerStyle = {
    border: "1px solid var(--text_color)",
    borderRadius: "0.5rem",
    overflowX: "auto",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const tableHeaderCellStyle = {
    padding: "1rem 1rem 1rem 0.5rem",
    fontWeight: "600",
    color: "var(--text_color)",
    textAlign: "left",
    paddingLeft: "1rem",
    background: "var(--bg_color)",
    borderBottom: "1px solid var(--text_color)",
  };

  const watchListEmptyStyle = {
    textAlign: "center",
    padding: "2rem 0",
    color: "#e4e4e7",
  };

  const columnStyles = {
    rank: { width: "10%" },
    name: {
      width: "25%",
      position: "sticky",
      left: "0",
      zIndex: "1",
      background: "var(--bg_color)",
    },
    price: { width: "20%" },
    percentage: { width: "20%" },
    marketCap: { width: "25%" },
    action: {
      width: "10%",
    },
  };

  return (
    <>
      {tokenList && tokenList.length !== 0 ? (
        <div style={containerStyle}>
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...tableHeaderCellStyle, ...columnStyles.rank }}>#</th>
                  <th style={{ ...tableHeaderCellStyle, ...columnStyles.name }}>Name</th>
                  <th style={{ ...tableHeaderCellStyle, ...columnStyles.price }}>Price</th>
                  <th style={{ ...tableHeaderCellStyle, ...columnStyles.percentage }}>24h %</th>
                  <th style={{ ...tableHeaderCellStyle, ...columnStyles.marketCap }}>Market Cap</th>
                  <th style={{ ...tableHeaderCellStyle, ...columnStyles.action }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tokenList.map((token) => (
                  <TokenItemList
                    token={token}
                    userData={userData}
                    key={token.id}
                    columnStyles={columnStyles}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        watchlisted && (
          <div style={containerStyle}>
            <p style={watchListEmptyStyle}>Your Watch List is empty.</p>
          </div>
        )
      )}
    </>
  );
};

export default TokenList;
