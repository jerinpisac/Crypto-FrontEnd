import React, { useContext, useEffect, useState } from "react";
import { Metadata } from "next";
import TokenList from "../components/TokenList";
import TokenContext from "../context/tokenContext";
import UserContext from "../context/userContext";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";
import ModalContext from "../context/modalContext";
import Header from "../components/Header";
import Chatbot from "@/components/Chatbot";

const Explore = () => {
  const { userData } = useContext(UserContext);
  const { tokens, setTokens, watchlisted, setWatchlisted } =
    useContext(TokenContext);
  const [allTokens, setAllTokens] = useState(true);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const { showModal, setShowModal, isLogin, setIsLogin } =
    useContext(ModalContext);

  const toggleView = () => {
    setAllTokens(!allTokens);
  };

  const fetchWatchlisted = async () => {
    const response = await fetch(
      `http://localhost:5000/api/exchange/fetchwatchlisted`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    if (data.length > 0) {
      const queryParams = data.join(",");
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${queryParams}&sparkline=false&x_cg_demo_api_key=CG-jnExJhB6zaJy6aSV5CzpouTq`;
      const pricesData = await (await fetch(url)).json();
      pricesData.forEach((token) => (token.iswatchlisted = true));
      setWatchlisted(pricesData);
      setWatchlistCount(pricesData.length);
      return pricesData;
    }
    return [];
  };

  const fetchTokens = async ({ pageParam = 1 }) => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=10&page=${pageParam}&sparkline=false&x_cg_demo_api_key=CG-jnExJhB6zaJy6aSV5CzpouTq`
    );
    const data = await response.json();
    setTokens((prev) => (prev ? [...prev, ...data] : data));
    return data;
  };

  const coinsQuery = useInfiniteQuery({
    queryKey: ["all-coins"],
    queryFn: fetchTokens,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 10 ? pages.length + 1 : undefined,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const watchlistedQuery = useQuery({
    queryKey: ["watchlisted-coins"],
    queryFn: fetchWatchlisted,
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !!userData,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (userData && !watchlistedQuery.data) {
      watchlistedQuery.refetch();
    }
    if (!userData) {
      setWatchlisted([]);
      setWatchlistCount(0);
      queryClient.removeQueries(["watchlisted-coins"]);
    }
  }, [userData]);

  useEffect(() => {
    if (coinsQuery.data && watchlisted) {
      const updatedTokens = coinsQuery.data.pages.map((page) =>
        page.map((token) => {
          const isWatchlisted = watchlisted.some(
            (item) => item.id === token.id
          );
          return { ...token, iswatchlisted: isWatchlisted };
        })
      );
      queryClient.setQueryData(["all-coins"], {
        ...coinsQuery.data,
        pages: updatedTokens,
      });
    }
  }, [coinsQuery.data, watchlisted]);

  useEffect(() => {
    if (watchlistedQuery.data) {
      if (allTokens) {
        queryClient.setQueryData(["watchlisted-coins"], watchlisted);
      }
      setWatchlistCount(watchlisted?.length || 0);
    }
  }, [allTokens, watchlisted]);

  const loadMore = () => {
    coinsQuery.fetchNextPage();
  };

  const toggleLoginModal = () => {
    setShowModal(true);
    setIsLogin(true);
  };

  const toggleSignupModal = () => {
    setShowModal(true);
    setIsLogin(false);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const buttonStyle = {
    marginRight: "10px",
    cursor: "pointer",
    border: "1px solid #ccc",
    backgroundColor: "var(--text_color)",
    color: "var(--bg_color)",
    borderBottom: "2px solid #fff",
  };

  const selectedButtonStyle = {
    ...buttonStyle,
  };

  const unselectedButtonStyle = {
    ...buttonStyle,
    color: "#aaa",
  };

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <Header />
      {userData ? (
        <div
          style={{
            backgroundColor: "var(--bg_color)",
            paddingTop: "100px",
          }}
        >
          <Chatbot />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <button
              type="button"
              style={allTokens ? selectedButtonStyle : unselectedButtonStyle}
              onClick={toggleView}
              className="allcryptobtn"
            >
              All Cryptos
            </button>

            <button
              type="button"
              style={allTokens ? unselectedButtonStyle : selectedButtonStyle}
              onClick={toggleView}
              className="watchlistbtn"
            >
              Watch List
              <span
                style={{
                  marginLeft: "10px",
                  backgroundColor: "var(--text_color)",
                }}
              >
                {watchlistCount}
              </span>
            </button>
            <button
              type="button"
              style={{ ...buttonStyle }}
              onClick={refreshPage}
              className="refreshbtn"
            >
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#333",
            margin: "20px auto",
            padding: "20px",
            borderRadius: "10px",
            maxWidth: "800px",
            textAlign: "center",
            borderBottom: "1px solid #444",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "20px", color: "#fff" }}>
              Trade, manage, and maximize your Crypto Investments effortlessly.
            </p>
            <p style={{ fontSize: "14px", color: "#aaa" }}>
              <button
                style={{
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={toggleLoginModal}
              >
                Login
              </button>{" "}
              or{" "}
              <button
                style={{
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={toggleSignupModal}
              >
                Signup
              </button>{" "}
              to start your journey.
            </p>
          </div>
        </div>
      )}

      {coinsQuery.isError && (
        <div
          style={{
            margin: "20px auto",
            padding: "20px",
            maxWidth: "800px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#fff" }}>
            Some error occurred. Please try again later.
          </p>
        </div>
      )}

      {coinsQuery.isSuccess && (
        <TokenList
          tokenList={allTokens ? coinsQuery.data.pages.flat() : watchlisted}
          watchlisted={!allTokens}
        />
      )}

      {allTokens && !coinsQuery.isError && (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <button
            disabled={coinsQuery.isFetching}
            type="button"
            style={{
              borderRadius: "50px",
              padding: "10px 20px",
              border: "1px solid var(--text_color)",
              backgroundColor: "var(--bg_color)",
              color: "var(--text_color)",
              cursor: coinsQuery.isFetching ? "not-allowed" : "pointer",
            }}
            onClick={loadMore}
          >
            {coinsQuery.isFetching ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
};

export default Explore;
