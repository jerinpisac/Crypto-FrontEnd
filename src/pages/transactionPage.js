import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";
import { useRouter } from "next/router";
import LoadingSpinner from "../components/LoadingSpinner";
import Image from "next/image";
import Head from "next/head";
import Header from "../components/Header";
import { hover } from "framer-motion";

const Transactions = () => {
  const { userData, setUserData } = useContext(UserContext);

  const [transactions, setTransactions] = useState();

  const router = useRouter();

  const fetchTransactions = async () => {
    const response = await fetch(
      `http://localhost:5000/api/exchange/fetchtransactions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
          "Access-Control-Max-Age": 600,
        },
      }
    );
    const data = await response.json();
    setTransactions(data);
  };

  useEffect(() => {
    if (userData !== undefined && userData === null) {
      router.push("/homePage");
    }
    if (userData) {
      fetchTransactions();
    }
  }, [userData]);

  const formatDateTime = (type, string) => {
    const date = new Date(string);
    const now = new Date();

    if (type === 1) {
      const diffInMilliseconds = now - date;
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays >= 7) {
        return Math.floor(diffInDays / 7) + "w ago";
      } else if (diffInDays >= 1) {
        return diffInDays + "d ago";
      } else if (diffInHours >= 1) {
        return diffInHours + "h ago";
      } else if (diffInMinutes >= 1) {
        return diffInMinutes + "m ago";
      } else {
        return diffInSeconds + "s ago";
      }
    } else {
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    }
  };

  const formatFloat = (number, toFixedN) => {
    const doubleNumber = Number(number);

    if (isNaN(doubleNumber)) {
      throw new Error("Invalid number provided");
    }

    return parseFloat(doubleNumber.toFixed(toFixedN)).toLocaleString("en-IN");
  };

  if (transactions === undefined) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (transactions.length < 1) {
    return (
      <>
        <Header />
        <div style={{ margin: "10rem", textAlign: "center", color: "#ccc" }}>
          <p>You have no transactions yet.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Transactions</title>
      </Head>
      <Header />
      {userData && (
        <div className="maintrans" style={{ padding: "1rem" }}>
          {transactions && transactions.length > 0 && (
            <>
              <h1
                style={{
                  fontSize: "1.2rem",
                  color: "var(--text_color)",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                Transactions
              </h1>
              <div
                style={{
                  overflowX: "auto",
                  border: "1px solid var(--text_color)",
                  borderRadius: "8px",
                  paddingBottom: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "table",
                    width: "100%",
                    fontSize: "0.9rem",
                  }}
                >
                  <div
                    style={{
                      display: "table-header-group",
                      backgroundColor: "var(--bg_color)",
                    }}
                  >
                    <div
                      className="transaction"
                      style={{
                        display: "table-row",
                        fontWeight: "bold",
                        color: "var(--text_color)",
                      }}
                    >
                      <div
                        className="trans"
                        style={{
                          display: "table-cell",
                          borderBottom: "1px solid var(--text_color)",
                        }}
                      >
                        Asset name
                      </div>
                      <div
                        className="trans"
                        style={{
                          display: "table-cell",
                          borderBottom: "1px solid var(--text_color)",
                        }}
                      >
                        Price
                      </div>
                      <div
                        className="trans"
                        style={{
                          display: "table-cell",
                          borderBottom: "1px solid var(--text_color)",
                        }}
                      >
                        Quantity
                      </div>
                      <div
                        className="trans"
                        style={{
                          display: "table-cell",
                          borderBottom: "1px solid var(--text_color)",
                        }}
                      >
                        Total Value
                      </div>
                      <div
                        className="trans"
                        style={{
                          display: "table-cell",
                          borderBottom: "1px solid var(--text_color)",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div style={{ display: "table-row-group" }}>
                    {transactions.map((transaction) => {
                      let totalValue = transaction.quantity * transaction.price;
                      let tokenUrl = `coins/${transaction.token_id}`;
                      return (
                        <div
                          className="transaction"
                          key={transaction.txn_timestamp}
                          style={{
                            display: "table-row",
                            backgroundColor: "var(--bg_color)",
                          }}
                        >
                          <div
                            className="transhead"
                            style={{
                              display: "table-cell",
                              padding: "0.75rem 1rem 1.6rem 1rem",
                              borderBottom: "1px solid var(--text_color)",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              className="transimg"
                              loader={() => transaction.image_url}
                              unoptimized={true}
                              src={transaction.image_url}
                              alt={transaction.name}
                              width={24}
                              height={24}
                              style={{
                                borderRadius: "50%",
                                marginRight: "0.5rem",
                              }}
                            />
                            <div>
                              <Link
                                href={tokenUrl}
                                style={{
                                  color: "var(--text_color)",
                                  textDecoration: "none",
                                }}
                              >
                                {transaction.name}
                              </Link>
                              <p className="transsymbol" style={{ color: "#aaa" }}>
                                {transaction.symbol.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div
                            className="trans"
                            style={{
                              display: "table-cell",
                              borderBottom: "1px solid var(--text_color)",
                              color: "var(--text_color)",
                            }}
                          >
                            ₹{transaction.price.toLocaleString("en-IN")}
                          </div>
                          <div
                            className="trans"
                            style={{
                              display: "table-cell",
                              borderBottom: "1px solid var(--text_color)",
                              color: "var(--text_color)",
                            }}
                          >
                            {Number.isInteger(transaction.quantity)
                              ? Math.abs(transaction.quantity)
                              : formatFloat(transaction.quantity, 3)}
                            {` ${transaction.symbol.toUpperCase()}`}
                          </div>
                          <div
                            className="trans"
                            style={{
                              display: "table-cell",
                              borderBottom: "1px solid var(--text_color)",
                              color: "var(--text_color)",
                            }}
                          >
                            <p style={{ fontWeight: "bold" }}>
                              {Number.isInteger(totalValue)
                                ? transaction.quantity > 0
                                  ? `-${totalValue}`
                                  : `+${totalValue * -1}`
                                : transaction.quantity > 0
                                ? `-${formatFloat(totalValue, 2)}`
                                : `+${formatFloat(totalValue * -1, 2)}`}
                              INR
                            </p>
                          </div>
                          <div
                            className="trans"
                            style={{
                              display: "table-cell",
                              borderBottom: "1px solid var(--text_color)",
                              textAlign: "right",
                              color: "var(--text_color)",
                            }}
                          >
                            {transaction.quantity > 0 ? (
                              <p>
                                <span style={{ fontWeight: "bold" }}>
                                  Bought
                                </span>{" "}
                                {formatDateTime(1, transaction.txn_timestamp)}
                              </p>
                            ) : (
                              <p>
                                <span style={{ fontWeight: "bold" }}>Sold</span>{" "}
                                {formatDateTime(1, transaction.txn_timestamp)}
                              </p>
                            )}
                            <p style={{ color: "#aaa" }}>
                              {formatDateTime(2, transaction.txn_timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Transactions;
