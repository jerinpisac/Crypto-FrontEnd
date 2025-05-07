import React, { useContext, useEffect, useState } from "react";
import TokenContext from "../context/tokenContext";
import ModalContext from "../context/modalContext";
import { motion } from "framer-motion";
import Toast from "./Toast";
import { useQueryClient } from "@tanstack/react-query";
import UserContext from "../context/userContext";

const WatchList = ({ token_id, isWatchlisted, isTokenPage }) => {
  const { userData } = useContext(UserContext);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const queryClient = useQueryClient();

  const { showModal, setShowModal, isLogin, setIsLogin } =
    useContext(ModalContext);

  let tokens, setTokens, watchlisted, setWatchlisted;
  if (true) {
    const context = useContext(TokenContext);
    tokens = context.tokens;
    setTokens = context.setTokens;
    watchlisted = context.watchlisted;
    setWatchlisted = context.setWatchlisted;
  }

  const [watchlistedCoin, setWatchlistedCoin] = useState();

  useEffect(() => {
    if (userData) {
      setWatchlistedCoin(isWatchlisted);
    } else {
      setWatchlistedCoin(false);
    }
  }, [userData, isWatchlisted]);

  const watchlistToken = async (e) => {
    e.preventDefault();

    if (token_id == false) {
      setShowModal(true);
      return;
    }

    const response = await fetch(`http://localhost:5000/api/token/watchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ symbol: token_id }),
    });
    const json = await response.json();

    setWatchlistedCoin(json.watchlisted);
    let coinName = token_id.charAt(0).toUpperCase() + token_id.slice(1);
    if (json.watchlisted) {
      setToastMessage(coinName + " added to watchlist.");
    } else {
      setToastMessage(coinName + " removed from watchlist.");
    }
    setShowToast(true);

    const updateState = () => {
      const index = tokens.findIndex((token) => token.id === token_id);
      const tokenObj = tokens.filter((token) => token.id === token_id);

      if (json.watchlisted) {
        const updatedCoin = tokenObj[0];
        updatedCoin.iswatchlisted = json.watchlisted;
        setWatchlisted([...watchlisted, updatedCoin]);
      } else {
        setWatchlisted(watchlisted.filter((w) => w.id !== token_id));
      }
    };
    updateState();
  };

  const svgVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.8 },
  };

  return (
    <>
      {showToast && (
        <div
          id="toast-success"
          style={{
            position: "fixed",
            zIndex: 50,
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "300px",
            padding: "1rem",
            marginBottom: "1rem",
            color: "#27272a",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
            borderRadius: "0.5rem",
            backgroundColor: "#bef264",
          }}
          role="alert"
        >
          <div style={{ fontSize: "0.875rem", fontWeight: "500" }}>
            {toastMessage}
          </div>
          <button
            type="button"
            style={{
              marginLeft: "auto",
              marginRight: "-0.375rem",
              marginTop: "-0.375rem",
              marginBottom: "-0.375rem",
              backgroundColor: "#ffffff",
              color: "#9ca3af",
              borderRadius: "0.5rem",
              padding: "0.375rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "2rem",
              width: "2rem",
              cursor: "pointer",
              border: "none",
              outline: "none",
            }}
            onClick={() => setShowToast(false)}
            aria-label="Close"
          >
            <span
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                clip: "rect(0 0 0 0)",
              }}
            >
              Close
            </span>
            <svg
              aria-hidden="true"
              style={{
                width: "1.25rem",
                height: "1.25rem",
                fill: "currentColor",
              }}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      )}
    </>
  );
};
WatchList.defaultProps = {
  isTokenPage: false,
};

export default WatchList;
