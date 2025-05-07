import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import Link from "next/link";
import WatchList from "../../components/Watchlist";
import { Modal } from "flowbite-react";
import ModalContext from "../../context/modalContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import Toast from "../../components/Toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import Header from "../../components/Header";

const Token = () => {
  const { userData, setUserData } = useContext(UserContext);
  const {
    showModal: showLoginModal,
    setShowModal: setShowLoginModal,
    isLogin,
    setIsLogin,
  } = useContext(ModalContext);

  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenDetails, setTokenDetails] = useState();
  const [activeDetails, setActiveDetails] = useState([]);
  const [transactionDetails, settransactionDetails] = useState([]);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [returnPercentage, setReturnPercentage] = useState(0);
  const [isBuy, setIsBuy] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [totalValue, setTotalValue] = useState(0);
  const [buyError, setBuyError] = useState("");
  const [sellError, setSellError] = useState("");
  const [ismodalActive, setIsModalActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const pathname = router.query.token;
    if (pathname) {
      setQuery(pathname);
    }
  }, [router.query]);

  useEffect(() => {
    if (userData) {
      setIsLoggedIn(true);
    } else if (userData === null) {
      setIsLoggedIn(false);
    }
  }, [userData]);

  const fetchTokens = async (token) => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${token}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    return data;
  };

  const fetchdetails = async (token_id) => {
    const response = await fetch(
      `http://localhost:5000/api/exchange/fetchdetails?token_id=${token_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    setActiveDetails(data.result[0]);
    if (data.result && data.result.length > 0) {
      settransactionDetails(data.result);
    } else {
      settransactionDetails([]);
    }
    setIsWatchlisted(data.iswatchlisted);
  };

  useEffect(() => {
    if (activeDetails && tokenDetails) {
      let investedValue = activeDetails.quantity * activeDetails.averageCost;
      let totalReturns =
        tokenDetails.market_data.current_price.inr * activeDetails.quantity -
        investedValue;
      setReturnPercentage((totalReturns / investedValue) * 100);
    }
  }, [activeDetails]);

  const coinQuery = useQuery({
    queryKey: ["fetched-coin", query],
    queryFn: () => {
      if (query) {
        return fetchTokens(query);
      } else {
        return [];
      }
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: query.length > 0,
  });

  useEffect(() => {
    if (coinQuery && coinQuery.data) {
      if (coinQuery.data.error) {
        queryClient.setQueryData(["fetched-coin"], null);
        setTokenDetails(null);
      } else {
        setTokenDetails(coinQuery.data);
        setTotalValue(quantity * coinQuery.data.market_data.current_price.inr);
      }
      if (isLoggedIn) {
        fetchdetails(coinQuery.data.id);
      }
    }
  }, [coinQuery.data, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setActiveDetails(null);
      settransactionDetails(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (userData) {
      if (totalValue > userData.cash) {
        setBuyError("You don't have enough INR balance");
      } else {
        setBuyError("");
      }
    }
  }, [quantity, totalValue]);

  useEffect(() => {
    if (tokenDetails && activeDetails && quantity > activeDetails.quantity) {
      setSellError(
        `You don't have enough ${tokenDetails.symbol.toUpperCase()} balance`
      );
    } else {
      setSellError("");
    }
  }, [quantity, totalValue]);

  useEffect(() => setIsModalActive(true), []);

  useEffect(() => {
    if (document) {
      document.body.style.overflow = showModal ? "hidden" : "auto";
    }
  }, [showModal]);

  const buySellBtn = () => {
    setIsBuy(!isBuy);
  };

  const onQuantityChanged = (e) => {
    let quantityCount = Number(e.target.value);
    setQuantity(quantityCount);

    let totalValueCount =
      quantityCount * tokenDetails.market_data.current_price.inr;
    if (!quantityCount) {
      setTotalValue(0);
    } else {
      setTotalValue(totalValueCount);
    }
  };

  const onTotalValueChanged = (e) => {
    let totalValueCount = Number(e.target.value);
    setTotalValue(totalValueCount);
    if (!totalValueCount) {
      setQuantity(0);
    } else {
      setQuantity(
        Number(totalValueCount / tokenDetails.market_data.current_price.inr)
      );
    }
  };

  const onConfirmationClick = async (e) => {
    let body = JSON.stringify({
      symbol: tokenDetails.symbol,
      name: tokenDetails.name,
      token_id: tokenDetails.id,
      quantity: quantity,
      price: tokenDetails.market_data.current_price.inr,
      image_url: tokenDetails.image.large,
    });

    if (!quantity) {
      setShowModal(false);
      setToastMessage(`Please enter a valid quantity.`);
      setShowToast(true);
      return;
    }

    if (isBuy) {
      e.target.innerText = "Buying...";
      const response = await fetch(`http://localhost:5000/api/token/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: body,
      });
      const json = await response.json();
      if (json.success) {
        setShowModal(false);
        setToastMessage(
          `Bought ${formatFloat(json.details.quantity, 3)} ${
            json.details.name
          } worth ${formatFloat(json.details.totalValue, 2)}INR!`
        );
        setShowToast(true);

        setUserData({
          ...userData,
          cash: userData.cash - parseFloat(totalValue.toFixed(2)),
        });

        if (activeDetails) {
          let newQuantity = activeDetails.quantity + quantity;
          let newTotalInvested =
            activeDetails.quantity * activeDetails.averageCost + totalValue;
          setActiveDetails({
            ...activeDetails,
            quantity: newQuantity,
            averageCost: newTotalInvested / newQuantity,
          });

          let totalReturns =
            tokenDetails.market_data.current_price.inr * newQuantity -
            newTotalInvested;
          setReturnPercentage((totalReturns / newTotalInvested) * 100);
        } else {
          setActiveDetails({
            ...activeDetails,
            quantity: quantity,
            averageCost: totalValue / quantity,
          });
          setReturnPercentage(0);
        }

        const now = new Date();
        const isoString = now.toISOString();
        let newTransaction = {
          txn_timestamp: isoString,
          symbol: tokenDetails.market_data.symbol,
          quantity: quantity,
          price: tokenDetails.market_data.current_price.inr,
        };
        settransactionDetails([newTransaction, ...transactionDetails]);

        setQuantity(0);
        setTotalValue(0);

        e.target.innerText = "Confirm Buy";
      } else {
        setShowModal(false);
        setToastMessage(json.error);
        setShowToast(true);
      }
    } else {
      e.target.innerText = "Selling...";
      const response = await fetch(`http://localhost:5000/api/token/sell`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: body,
      });
      const json = await response.json();
      if (json.success) {
        setShowModal(false);
        setToastMessage(
          `Sold ${formatFloat(json.details.quantity, 3)} ${
            json.details.name
          } worth ${formatFloat(json.details.totalValue, 2)}INR!`
        );
        setShowToast(true);

        setUserData({
          ...userData,
          cash: userData.cash + parseFloat(totalValue.toFixed(2)),
        });
        let newQuantity = activeDetails.quantity - quantity;
        let newInvestedValue =
          activeDetails.quantity * activeDetails.averageCost - totalValue;

        if (newQuantity === 0) {
          setActiveDetails(null);
        } else {
          setActiveDetails({
            ...activeDetails,
            quantity: newQuantity,
            averageCost: newInvestedValue / newQuantity,
          });
        }

        let totalReturns =
          tokenDetails.market_data.current_price.inr * newQuantity -
          newInvestedValue;
        setReturnPercentage((totalReturns / newInvestedValue) * 100);

        const now = new Date();
        const isoString = now.toISOString();
        let newTransaction = {
          txn_timestamp: isoString,
          symbol: transactionDetails.symbol,
          quantity: quantity * -1,
          price: tokenDetails.market_data.current_price.inr,
        };
        settransactionDetails([newTransaction, ...transactionDetails]);

        setQuantity(0);
        setTotalValue(0);

        e.target.innerText = "Confirm Sell";
      } else {
        setShowModal(false);
        setToastMessage(json.error);
        setShowToast(true);
      }
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const onModalClose = () => {
    setShowModal(false);
  };

  const onNonUserLoginBtnClick = () => {
    setIsLogin(true);
    setShowLoginModal(true);
  };

  const formatTime = (string) => {
    const date = new Date(string);
    const now = new Date();

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
  };

  const formatFloat = (number, toFixedN) => {
    if (number === "0.00") {
      return parseFloat("0.00");
    }
    if (Math.abs(number) < 0.0001) {
      return parseFloat(number.toFixed(5));
    } else if (Math.abs(number) < 0.001) {
      return parseFloat(number.toFixed(4));
    } else {
      return parseFloat(number).toFixed(toFixedN).toLocaleString("en-IN");
    }
  };

  if (tokenDetails === undefined) {
    return (
      <div style={{ padding: "2rem" }}>
        <LoadingSpinner />
      </div>
    );
  } else if (tokenDetails === null) {
    return (
      <div style={{ margin: "0 auto", maxWidth: "1120px", padding: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2rem 0",
          }}
        >
          <p
            style={{ padding: "1rem", textAlign: "center", color: "#ccc" }}
          ></p>
          Coin
          <span style={{ paddingLeft: "0.25rem", fontStyle: "italic" }}>
            {query}
          </span>{" "}
          not found. Explore coins
          <Link
            href="/explore"
            style={{
              paddingLeft: "0.25rem",
              textDecoration: "underline",
              color: "#ccc",
            }}
          >
            here.
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{tokenDetails.name}</title>
      </Head>
      <Header />
      <div style={{ color: "#fff" }}>
        <div
          style={{
            minHeight: "70vh",
            margin: "100px auto",
            maxWidth: "1120px",
            padding: "1rem",
            display: "flex",
            flexWrap: "wrap",
            color: "var(--text_color)",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ width: "100%", paddingRight: "0", marginBottom: "1rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  className="tokenimg"
                  style={{ borderRadius: "50%" }}
                  src={tokenDetails.image.large}
                  alt="Rounded avatar"
                />
              </div>

              <div
                style={{
                  marginLeft: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <p className="tokenname" style={{ fontWeight: "500" }}>
                      {tokenDetails.name}
                    </p>
                    <p className="tokensym" style={{ paddingLeft: "0.5rem", color: "#ccc" }}>
                      {tokenDetails.symbol.toUpperCase()}
                    </p>
                  </div>

                  <div style={{ marginLeft: "0rem" }}>
                    <WatchList
                      token_id={isLoggedIn ? tokenDetails.id : false}
                      isWatchlisted={isWatchlisted}
                      isTokenPage={true}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h1
                    className="tokenname"
                    style={{
                      fontWeight: "500",
                      marginRight: "0.5rem",
                    }}
                  >
                    ₹
                    {tokenDetails.market_data.current_price.inr.toLocaleString(
                      "en-IN"
                    )}
                  </h1>
                  {tokenDetails.market_data.price_change_percentage_24h >= 0 ? (
                    <p
                      className="tokencp"
                      style={{
                        borderRadius: "9999px",
                        border: "1px solid #4caf50",
                        color: "#4caf50",
                      }}
                    >
                      {tokenDetails.market_data.price_change_percentage_24h.toFixed(
                        2
                      )}
                      %
                    </p>
                  ) : (
                    <p
                      className="tokencp"
                      style={{
                        borderRadius: "9999px",
                        border: "1px solid #f44336",
                        color: "#f44336",
                      }}
                    >
                      {tokenDetails.market_data.price_change_percentage_24h.toFixed(
                        2
                      )}
                      %
                    </p>
                  )}
                </div>
              </div>
            </div>

            {activeDetails && activeDetails.length !== 0 && (
              <div
                style={{
                  backgroundColor: "inherit",
                  border: "1px solid #444",
                  borderRadius: "0.5rem",
                  margin: "1rem 0",
                  marginTop: "30px",
                  marginBottom: "40px"
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    color: "#ccc",
                    padding: "1rem",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Summary
                </h3>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      flexBasis: "50%",
                      borderBottom: "1px solid #444",
                      padding: "1rem",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <p style={{ fontSize: "0.875rem", color: "#ccc", marginBottom: "10px", marginRight: "10px" }}>
                        Available Qty.
                      </p>
                      <p style={{ fontWeight: "500" }}>
                        {parseFloat(activeDetails.quantity).toFixed(5)}{" "}
                        {tokenDetails.symbol.toUpperCase()}
                      </p>
                    </div>
                    <p style={{ fontSize: "0.875rem" }}>
                      {formatFloat(
                        tokenDetails.market_data.current_price.inr *
                          activeDetails.quantity,
                        2
                      )}
                      INR
                      {returnPercentage >= 0 ? (
                        <span
                          style={{ paddingLeft: "0.5rem", color: "#4caf50" }}
                        >
                          ({formatFloat(returnPercentage, 2)}%)
                        </span>
                      ) : (
                        <span
                          style={{ paddingLeft: "0.5rem", color: "#f44336" }}
                        >
                          ({formatFloat(returnPercentage, 2)}%)
                        </span>
                      )}
                    </p>
                  </div>

                  <div style={{ flexBasis: "50%", padding: "1rem" }}>
                    <div style={{ display: "flex" }}>
                      <p style={{ fontSize: "0.875rem", color: "#ccc", marginBottom: "10px", marginRight: "10px" }}>
                        Invested value
                      </p>
                      <p style={{ fontWeight: "500", marginBottom: "8px" }}>
                        {formatFloat(
                          activeDetails.quantity * activeDetails.averageCost,
                          2
                        )}
                        INR
                      </p>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#ccc" }}>
                      Avg Price:
                      <span style={{ color: "#fff", marginLeft: "10px" }}>
                        {formatFloat(activeDetails.averageCost, 2)}INR
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: "1.5rem" }}>
              <p
                className="tokenmd"
                style={{
                  color: "var(--text_color)",
                  // fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Market Data
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flexGrow: "1", borderRight: "2px solid #444" }}>
                  <p
                    className="tokenmc"
                    style={{ color: "var(--text_color)" }}
                  >
                    Market Cap
                  </p>
                  <p className="tokenmcinr">
                    ₹
                    {tokenDetails.market_data.market_cap.inr.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
                <div style={{ flexGrow: "1" }}>
                  <p
                    className="tokenmd"
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text_color)",
                      fontWeight: "600",
                    }}
                  >
                    Total Volume
                  </p>
                  <p className="tokenmcinr">
                    ₹
                    {tokenDetails.market_data.total_volume.inr.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <p
                className="tokenmd"
                style={{
                  fontSize: "1rem",
                  color: "var(--text_color)",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                }}
              >
                Additional Details
              </p>

              <div style={{ marginBottom: "0.5rem" }}>
                <p className="tokenmc" style={{ fontSize: "0.875rem", color: "var(--text_color)" }}>
                  Official Website
                </p>
                <a
                  href={tokenDetails.links.homepage[0]}
                  style={{ textDecoration: "none", color: "#7494ec" }}
                >
                  {tokenDetails.links.homepage[0]}
                </a>
              </div>
              <div style={{ marginTop: "2rem" }}>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "1.3rem",
                    color: "var(--text_color)",
                    marginBottom: "1rem",
                    fontWeight: "600",
                  }}
                >
                  Description
                </p>
                {tokenDetails.description.en === "" ? (
                  <p>N.A</p>
                ) : (
                  <p
                    className="tokendesc"
                    style={{ marginBottom: "0.75rem", textAlign: "justify" }}
                    dangerouslySetInnerHTML={{
                      __html: tokenDetails.description.en,
                    }}
                  ></p>
                )}
              </div>
            </div>
          </div>

          <div style={{ width: "100%" }}>
            <div
              style={{
                backgroundColor: "var(--bg_color)",
                border: "1px solid var(--text_color)",
                borderRadius: "0.75rem",
                color: "#ccc",
                display: "flex",
                flexDirection: "column",
                marginTop: "2.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "1.5rem",
                  fontSize: "0.875rem",
                  borderBottom: "1px solid var(--text_color)",
                }}
              >
                <button
                  style={{
                    flex: "1",
                    textAlign: "center",
                    borderRadius: "9999px",
                    padding: "0.5rem",
                    backgroundColor: "var(--bg_color)",
                    border: isBuy
                      ? "2px solid #b2ff59"
                      : "1px solid var(--text_color)",
                    color: isBuy ? "#b2ff59" : "var(--text_color)",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={buySellBtn}
                >
                  Buy
                </button>
                <button
                  style={{
                    flex: "1",
                    textAlign: "center",
                    borderRadius: "9999px",
                    padding: "0.5rem",
                    backgroundColor: "var(--bg_color)",
                    border: !isBuy
                      ? "2px solid #b2ff59"
                      : "1px solid var(--text_color)",
                    color: !isBuy ? "#b2ff59" : "var(--text_color)",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={buySellBtn}
                >
                  Sell
                </button>
              </div>

              <form>
                <div style={{ padding: "1rem 1.25rem" }}>
                  <label
                    htmlFor="quantity"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--text_color)",
                    }}
                  >
                    Enter Quantity
                  </label>
                  <div
                    style={{
                      display: "flex",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--text_color)",
                      focusWithin: { borderColor: "#b2ff59" },
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        width: "20%",
                        justifyContent: "center",
                        margin: "0.375rem",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        color: "var(--text_color)",
                        borderRight: "1px solid #444",
                      }}
                    >
                      {tokenDetails.symbol.toUpperCase()}
                    </span>
                    <input
                      type="number"
                      id="quantity"
                      style={{
                        borderRadius: "0.5rem",
                        backgroundColor: "inherit",
                        border: "0",
                        color: "var(--text_color)",
                        flex: "1",
                        minWidth: "0",
                        width: "100%",
                        fontSize: "0.875rem",
                        padding: "0.75rem",
                      }}
                      placeholder="0.0"
                      min="0"
                      value={quantity ? parseFloat(quantity.toFixed(3)) : ""}
                      onChange={onQuantityChanged}
                    />
                  </div>
                </div>
                <div style={{ padding: "0.75rem 1.25rem" }}>
                  <label
                    htmlFor="totalValue"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--text_color)",
                    }}
                  >
                    Total Value
                  </label>
                  <div
                    style={{
                      display: "flex",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--text_color)",
                      focusWithin: { borderColor: "#b2ff59" },
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        width: "20%",
                        justifyContent: "center",
                        margin: "0.375rem",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        color: "var(--text_color)",
                        borderRight: "1px solid #444",
                      }}
                    >
                      INR
                    </span>
                    <input
                      type="number"
                      id="totalValue"
                      style={{
                        borderRadius: "0.5rem",
                        backgroundColor: "inherit",
                        border: "0",
                        color: "var(--text_color)",
                        flex: "1",
                        minWidth: "0",
                        width: "100%",
                        fontSize: "0.875rem",
                        padding: "0.75rem",
                      }}
                      placeholder="0.0"
                      min="0"
                      value={
                        totalValue ? parseFloat(totalValue.toFixed(2)) : ""
                      }
                      onChange={onTotalValueChanged}
                    />
                  </div>
                </div>

                {userData ? (
                  isBuy ? (
                    <>
                      <div
                        style={{
                          padding: "0 1.25rem",
                          color: "var(--text_color)",
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.75rem",
                        }}
                      >
                        <p style={{ marginBottom: "0.5rem" }}>INR Balance</p>
                        <p>₹{userData.cash && formatFloat(userData.cash, 2)}</p>
                      </div>
                      {buyError && (
                        <div
                          style={{
                            marginTop: "0",
                            padding: "1rem 1.25rem 0",
                            fontSize: "0.875rem",
                            color: "#ffeb3b",
                            borderRadius: "0.5rem",
                          }}
                          role="alert"
                        >
                          <span style={{ fontWeight: "500" }}></span> {buyError}
                        </div>
                      )}

                      <div style={{ padding: "1.5rem 1.25rem" }}>
                        <button
                          type="button"
                          style={{
                            cursor: "pointer",
                            width: "100%",
                            borderRadius: "5rem",
                            color: "#b2ff59",
                            backgroundColor: "var(--bg_color)",
                            fontSize: "0.875rem",
                            padding: "0.75rem 1.25rem",
                            textAlign: "center",
                            fontWeight: "600",
                            border: "2px solid #b2ff59",
                          }}
                          onClick={openModal}
                        >
                          Buy
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          padding: "0 1.25rem",
                          color: "var(--text_color)",
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.75rem",
                        }}
                      >
                        <p style={{ marginBottom: "0.5rem" }}>
                          {tokenDetails.symbol.toUpperCase()} Balance
                        </p>
                        <p>
                          {activeDetails && activeDetails.quantity
                            ? formatFloat(activeDetails.quantity, 3)
                            : "0"}
                          {tokenDetails.symbol.toUpperCase()}
                        </p>
                      </div>
                      {sellError && (
                        <div
                          style={{
                            marginTop: "0",
                            padding: "1rem 1.25rem 0",
                            fontSize: "0.875rem",
                            color: "#ffeb3b",
                            borderRadius: "0.5rem",
                          }}
                          role="alert"
                        >
                          <span style={{ fontWeight: "500" }}></span>{" "}
                          {sellError}
                        </div>
                      )}
                      <div style={{ padding: "1.5rem 1.25rem" }}>
                        <button
                          type="button"
                          style={{
                            cursor: "pointer",
                            width: "100%",
                            borderRadius: "5rem",
                            color: "#b2ff59",
                            backgroundColor: "var(--bg_color)",
                            fontSize: "0.875rem",
                            padding: "0.75rem 1.25rem",
                            textAlign: "center",
                            fontWeight: "600",
                            border: "2px solid #b2ff59",
                          }}
                          onClick={openModal}
                        >
                          Sell
                        </button>
                      </div>
                    </>
                  )
                ) : (
                  <div style={{ padding: "1.5rem 1.25rem" }}>
                    <button
                      type="button"
                      style={{
                        color: "#b2ff59",
                        backgroundColor: "var(--bg_color)",
                        border: "2px solid #b2ff59",
                        width: "100%",
                        fontSize: "0.875rem",
                        borderRadius: "0.5rem",
                        padding: "0.75rem 1.25rem",
                        textAlign: "center",
                      }}
                      onClick={onNonUserLoginBtnClick}
                    >
                      Login to buy/sell {tokenDetails.symbol.toUpperCase()}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {transactionDetails &&
              transactionDetails[0] !== undefined &&
              transactionDetails.length > 0 && (
                <div
                  style={{
                    border: "1px solid #444",
                    borderRadius: "0.5rem",
                    margin: "1rem 0",
                    paddingBottom: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      padding: "1rem",
                      color: "#ccc",
                      borderBottom: "1px solid #444",
                    }}
                  >
                    Recent Transaction
                  </h3>

                  {transactionDetails.map((transaction) => {
                    return (
                      <div
                        style={{
                          borderBottom: "1px solid #444",
                          fontSize: "0.875rem",
                          padding: "1rem",
                        }}
                        key={transaction.txn_timestamp}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{ width: "100%" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>
                                {transaction.quantity > 0 ? "Bought " : "Sold "}
                                {formatFloat(Math.abs(transaction.quantity), 3)}
                                {tokenDetails.symbol.toUpperCase()}{" "}
                                {transaction.quantity > 0 ? (
                                  <span style={{ fontWeight: "500" }}>
                                    -
                                    {formatFloat(
                                      Math.abs(
                                        transaction.price * transaction.quantity
                                      ),
                                      2
                                    )}
                                    INR
                                  </span>
                                ) : (
                                  <span style={{ fontWeight: "500" }}>
                                    +
                                    {formatFloat(
                                      Math.abs(
                                        transaction.price * transaction.quantity
                                      ),
                                      2
                                    )}
                                    INR
                                  </span>
                                )}
                              </p>
                              <p
                                style={{ fontSize: "0.875rem", color: "#ccc" }}
                              >
                                {formatTime(transaction.txn_timestamp)}
                              </p>
                            </div>

                            <p style={{ fontSize: "0.875rem", color: "#ccc" }}>
                              (@{formatFloat(transaction.price, 2)}INR)
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* modal */}

      {ismodalActive && (
        <Modal
          show={showModal}
          size="md"
          dismissible={true}
          onClose={onModalClose}
          className="bg-zinc-900 backdrop-opacity-10 border border-zinc-750"
          style={{
            minHeight: "100vh",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="confirmmodal"
            style={{
              border: "1px solid var(--text_color)",
              color: "var(--text_color)",
              padding: "2rem",
              backdropFilter: "blur(200px)",
              borderRadius: "10px",
            }}
          >
            <div>
              {/* <Modal.Header className="bg-yellow-800 border text-md dark:border-zinc-750" 
          style={{
            display: "flex",
            justifyContent: "right",
            marginBottom: "1rem"
          }}>
          </Modal.Header> */}
            <i className="fa fa-close" onClick={onModalClose} style={{ fontSize: "30px" }}></i>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "1rem",
                  fontSize: "1.5rem",
                }}
              >
                Confirm Order
              </div>
              <Modal.Body className="bg-zinc-800 text-zinc-200 border-x dark:border-zinc-750">
                <div className="space-y-2">
                  <p
                    className=""
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      marginBottom: "1rem",
                    }}
                  >
                    {isBuy
                      ? `Buy ${tokenDetails.name}`
                      : `Sell ${tokenDetails.name}`}
                  </p>
                  <div
                    className="flex justify-between"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <p className="text-sm">Price : </p>
                    <p className="text-sm" style={{ marginLeft: "0.5rem" }}>
                      {tokenDetails.market_data.current_price.inr.toLocaleString(
                        "en-IN"
                      )}{" "}
                      INR
                    </p>
                  </div>
                  <div
                    className="flex justify-between"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <p className="text-sm">Quantity :</p>
                    <p className="text-sm" style={{ marginLeft: "0.5rem" }}>
                      {parseFloat(quantity.toFixed(3))}{" "}
                      {tokenDetails.symbol.toUpperCase()}
                    </p>
                  </div>
                  <div
                    className="flex justify-between"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <p className="text-sm">Total :</p>
                    <p className="text-sm" style={{ marginLeft: "0.5rem" }}>
                      {parseFloat(totalValue.toFixed(2)).toLocaleString(
                        "en-IN"
                      )}{" "}
                      INR
                    </p>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer
                className="bg-zinc-800 border dark:border-zinc-750"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  data-modal-hide="confirm-modal"
                  type="button"
                  onClick={onConfirmationClick}
                  style={{
                    width: "80%",
                    height: "2rem",
                    border: "2px solid #b2ff59",
                    backgroundColor: "var(--bg_color)",
                    color: "#b2ff59",
                    borderRadius: "1rem",
                    cursor: "pointer",
                  }}
                  className="text-zinc-900 bg-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
                >
                  {isBuy ? "Confirm Buy" : "Confirm Sell"}
                </button>
              </Modal.Footer>
            </div>
          </div>
        </Modal>
      )}

      {showToast && (
        <Toast
          showToast={showToast}
          setShowToast={setShowToast}
          toastMessage={toastMessage}
        />
      )}
    </>
  );
};

export default Token;
