import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";
import Link from "next/link";
import PiechartComponent from "../components/PiechartComponent";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/LoadingSpinner";
import Head from "next/head";
import Header from "../components/Header";
import Dltoggle from "../components/Dltoggle";

const Portfolio = () => {
  const { userData, setUserData } = useContext(UserContext);

  const router = useRouter();

  const [tokens, setTokens] = useState();
  const [activeCoins, setActiveCoins] = useState();
  const [details, setDetails] = useState({
    portfolioValue: 0,
    totalInvested: 0,
    totalReturns: 0,
    returnsPercentage: 0,
  });

  const fetchActive = async () => {
    const response = await fetch(
      `http://localhost:5000/api/exchange/fetchactive`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );

    const data = await response.json();
    console.log(data);
    setTokens(data.tokens);
    setActiveCoins(data.tokenIds);
  };

  useEffect(() => {
    if (tokens && activeCoins) {
      const getLivePrices = async () => {
        const queryIds = activeCoins.join(",");
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${queryIds}&vs_currencies=inr&include_24hr_change=true&x_cg_demo_api_key=CG-jnExJhB6zaJy6aSV5CzpouTq`;
        const prices_response = await fetch(url);
        const prices_data = await prices_response.json();

        let totalInvested = 0,
          portfolioValue = 0,
          totalReturns = 0,
          returnsPercentage = 0;

        for (let i = 0; i < tokens.length; i++) {
          let id = tokens[i].token_id;
          tokens[i].price = prices_data[id];
          totalInvested += tokens[i].quantity * tokens[i].averageCost;
          portfolioValue += tokens[i].quantity * prices_data[id].inr;
        }

        totalReturns = portfolioValue - totalInvested;
        returnsPercentage = (totalReturns / totalInvested) * 100;

        setDetails({
          portfolioValue: portfolioValue,
          totalInvested: totalInvested,
          totalReturns: totalReturns,
          returnsPercentage: returnsPercentage,
        });
      };

      getLivePrices();
    }
  }, [tokens, activeCoins]);

  useEffect(() => {
    if (userData === null) {
      router.push("/homePage");
    }
    if (userData) {
      fetchActive();
    }
  }, [userData]);

  const formatFloat = (number, toFixedN) => {
    const doubleNumber = Number(number);

    if (isNaN(doubleNumber)) {
      throw new Error("Invalid number provided");
    }

    return parseFloat(doubleNumber.toFixed(toFixedN)).toLocaleString("en-IN");
  };

  const formatFloat2 = (number, toFixedN, sign) => {
    let floatStr =
      "₹" +
      parseFloat(Math.abs(number).toFixed(toFixedN)).toLocaleString("en-IN");
    if (sign) {
      if (number >= 0) {
        return "+" + floatStr;
      } else {
        return "-" + floatStr;
      }
    }
    return floatStr;
  };

  if (tokens === undefined) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (tokens.length < 1) {
    return (
      <div
        style={{
          maxWidth: "1120px",
          margin: "2.5rem auto",
          padding: "0 1.5rem",
        }}
      >
        <Header />
        <p style={{ padding: "2rem 0", textAlign: "center", color: "#d1d5db" }}>
          Your portfolio is currently empty.
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Portfolio</title>
      </Head>
      <Header />
      <Dltoggle />

      {userData && (
        <>
          <div
            style={{
              maxWidth: "1120px",
              margin: "2.5rem auto",
              padding: "0 1.5rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "start",
              marginTop: "100px",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                margin: "1rem 0",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "6rem",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "#d9f99d",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Current Value
                  </p>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#1f2937",
                    }}
                  >
                    {formatFloat2(details.portfolioValue, 2, false)}
                  </h3>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "6rem",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "#d9f99d",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Total Returns
                  </p>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#1f2937",
                    }}
                  >
                    {formatFloat2(details.totalReturns, 2, true)}
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        marginLeft: "0.5rem",
                        border: `1px solid ${
                          details.totalReturns > 0 ? "#10b981" : "#ef4444"
                        }`,
                        color: details.totalReturns > 0 ? "#10b981" : "#ef4444",
                      }}
                    >
                      {details.returnsPercentage > 0
                        ? "+" + formatFloat(details.returnsPercentage, 2)
                        : formatFloat(details.returnsPercentage, 2)}
                      %
                    </span>
                  </h3>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "6rem",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "#d9f99d",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Invested Value (INR)
                  </p>
                  <h1
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1f2937",
                    }}
                  >
                    ₹{formatFloat(details.totalInvested, 2)}
                  </h1>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    INR Balance
                  </p>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1f2937",
                    }}
                  >
                    ₹
                    {userData && userData !== undefined
                      ? formatFloat(userData.cash, 2)
                      : "0"}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              maxWidth: "1120px",
              margin: "2.5rem auto",
              padding: "0 1.5rem",
            }}
          >
            <p
              style={{ fontSize: "1rem", color: "#d1d5db", padding: "1rem 0" }}
            >
              All Assets
            </p>

            <div
              style={{
                overflowX: "auto",
                paddingBottom: "1rem",
                border: "1px solid #4b5563",
                borderRadius: "0.5rem",
              }}
            >
              <div style={{ width: "100%", display: "table" }}>
                <div style={{ display: "table-header-group" }}>
                  <div className="porthead" style={{ display: "table-row" }}>
                    <div
                      className="port"
                      style={{
                        display: "table-cell",
                        borderBottom: "1px solid #4b5563",
                        color: "#9ca3af",
                      }}
                    >
                      Asset name
                    </div>
                    <div
                      className="port"
                      style={{
                        display: "table-cell",
                        borderBottom: "1px solid #4b5563",
                        color: "#9ca3af",
                      }}
                    >
                      Price
                    </div>
                    <div
                      className="port"
                      style={{
                        display: "table-cell",
                        borderBottom: "1px solid #4b5563",
                        color: "#9ca3af",
                      }}
                    >
                      Holdings
                    </div>
                    <div
                      className="port"
                      style={{
                        display: "table-cell",
                        borderBottom: "1px solid #4b5563",
                        color: "#9ca3af",
                      }}
                    >
                      Invested INR
                    </div>
                    <div
                      className="port"
                      style={{
                        display: "table-cell",
                        // padding: "1rem",
                        borderBottom: "1px solid #4b5563",
                        color: "#9ca3af",
                      }}
                    >
                      Returns
                    </div>
                  </div>
                </div>
                <div style={{ display: "table-row-group" }}>
                  {tokens[0].price &&
                    tokens.map((token) => {
                      let tokenUrl = `coins/${token.token_id}`;
                      let investedValue = token.quantity * token.averageCost;
                      let totalReturns =
                        token.price.inr * token.quantity - investedValue;
                      let returnsPercentage =
                        (totalReturns / investedValue) * 100;
                      return (
                        <div
                          key={token.token_id}
                          style={{ display: "table-row", color: "white" }}
                        >
                          <div
                            className="portbody"
                            style={{
                              display: "table-cell",
                              borderBottom: "1px solid #4b5563",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                // justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img
                                className="portimg"
                                src={token.image_url}
                                alt={token.name}
                                style={{
                                  borderRadius: "9999px",
                                }}
                              />
                              <div className="porthead" style={{ marginLeft: "0.75rem" }}>
                                <Link
                                  href={tokenUrl}
                                  style={{
                                    fontWeight: "500",
                                    color: "#9ca3af",
                                    textDecoration: "none",
                                  }}
                                >
                                  {token.name}
                                </Link>
                                <p
                                  className="portsym"
                                  style={{
                                    color: "#9ca3af",
                                  }}
                                >
                                  {token.symbol.toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className="portbody"
                            style={{
                              display: "table-cell",
                              // padding: "1rem",
                              borderBottom: "1px solid #4b5563",
                            }}
                          >
                            ₹{token.price.inr.toLocaleString("en-IN")}
                          </div>
                          <div
                            className="portbody"
                            style={{
                              display: "table-cell",
                              // padding: "1rem",
                              paddingBottom: "0.85rem",
                              borderBottom: "1px solid #4b5563",
                              display: "flex",
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                              alignItems: 'baseline'
                            }}
                          >
                            <p
                              style={{
                                fontWeight: "500",
                                color: "#9ca3af",
                              }}
                            >
                              ₹
                              {formatFloat(token.quantity * token.price.inr, 2)}
                            </p>
                            <p
                              style={{ color: "#9ca3af" }}
                            >
                              {formatFloat(token.quantity, 3)}
                              {token.symbol.toUpperCase()}
                            </p>
                          </div>
                          <div
                            className="portbody"
                            style={{
                              display: "table-cell",
                              // padding: "1rem",
                              borderBottom: "1px solid #4b5563",
                            }}
                          >
                            ₹{formatFloat(investedValue, 2)}
                          </div>
                          <div
                            className="portbody"
                            style={{
                              display: "table-cell",
                              // padding: "1rem",
                              borderBottom: "1px solid #4b5563",
                            }}
                          >
                            <div
                              className="portreturns"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center"
                              }}
                            >
                              <p
                                style={{
                                  fontWeight: "500",
                                  color:
                                    totalReturns >= 0 ? "#10b981" : "#ef4444",
                                    marginBottom: "5px"
                                }}
                              >
                                {formatFloat2(totalReturns, 2, true)}
                              </p>
                              <p
                                className="portbadge"
                                style={{
                                  fontWeight: "600",
                                  borderRadius: "9999px",
                                  marginLeft: "0.5rem",
                                  border: `1px solid ${
                                    returnsPercentage >= 0
                                      ? "#10b981"
                                      : "#ef4444"
                                  }`,
                                  color:
                                    returnsPercentage >= 0
                                      ? "#10b981"
                                      : "#ef4444",
                                }}
                              >
                                {returnsPercentage > 0
                                  ? "+" + formatFloat(returnsPercentage, 2)
                                  : formatFloat(returnsPercentage, 2)}
                                %
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              maxWidth: "1120px",
              margin: "2.5rem auto",
              padding: "0 1.5rem",
            }}
          >
            <p
              style={{ fontSize: "1.5rem", color: "#d1d5db", padding: "1rem 0" }}
            >
              Insights
            </p>

            {tokens[0].price && (
              <div style={{ overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", }}>
                <PiechartComponent
                  portfolioValue={details.portfolioValue}
                  tokens={tokens}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Portfolio;
