import "@/styles/globals.css";
import Navbar from "../components/Header";
import Footer from "../components/Footer";
import UserContext from "../context/userContext";
import { useEffect, useMemo, useState } from "react";
import App from "next/app";
import ModalContext from "../context/modalContext";
import { useRouter } from "next/router";
import LoadingBar from "react-top-loading-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TokenContext from "../context/tokenContext";
import { Analytics } from "@vercel/analytics/react";

export default function MyApp({ Component, pageProps }) {
  const [userData, setUserData] = useState();
  const [authtoken, setAuthtoken] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [tokens, setTokens] = useState([]);
  const [watchlisted, setWatchlisted] = useState([]);

  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const queryClient = useMemo(() => new QueryClient(), []);

  const fetchUser = async (authToken) => {
    const response = await fetch(`http://localhost:5000/api/auth/getuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
    });
    const user = await response.json();
    if (user.success) {
      setUserData(user.user);
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(20);
    });

    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthtoken(token);
    } else {
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    if (authtoken) {
      fetchUser(authtoken);
    } else if (authtoken === null) {
      setUserData(null);
      queryClient.removeQueries(["watchlisted-coins"]);
    }
  }, [authtoken]);

  useEffect(() => {
    if (document) {
      document.body.style.overflow = showModal ? "hidden" : "auto";
    }
  }, [showModal]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setUserData(null);
    setAuthtoken(null);
    router.push("/homePage");
  };
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider
          value={{
            userData,
            setUserData,
            authtoken,
            setAuthtoken,
            handleLogout,
          }}
        >
          <ModalContext.Provider
            value={{ showModal, setShowModal, isLogin, setIsLogin }}
          >
            <TokenContext.Provider
              value={{ tokens, setTokens, watchlisted, setWatchlisted }}
            >
              <LoadingBar
                color={"#d9f99d"}
                progress={progress}
                waitingTime={400}
                onLoaderFinished={() => setProgress(0)}
              />
              <Component {...pageProps} />
            </TokenContext.Provider>
          </ModalContext.Provider>
        </UserContext.Provider>
      </QueryClientProvider>
      <Analytics />
    </>
  );
}
