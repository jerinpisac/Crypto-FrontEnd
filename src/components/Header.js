import Dltoggle from "./Dltoggle";
import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context/userContext";
import dynamic from "next/dynamic";
import ModalContext from "../context/modalContext";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import LoadingBar from "react-top-loading-bar";
import InnerNavbar from "./InnerHeader"; // Import the InnerNavbar component

const AuthModal = dynamic(() => import("./UserAuthModal"), { ssr: false });

function Header({ activeSection, scrollToSection }) {
  const [sidebar, setsidebar] = useState(false);
  const [navmenu, setNavmenu] = useState(false);
  const { userData, setUserData, authtoken, setAuthtoken } =
    useContext(UserContext);

  const router = useRouter();

  const isActive = (section) => activeSection === section;

  const addShadow = () => {
    setNavmenu(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", addShadow);
    return () => window.removeEventListener("scroll", addShadow);
  }, []);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { showModal, setShowModal, isLogin, setIsLogin } =
    useContext(ModalContext);

  const menuRef = useRef();

  const toggleLoginModal = () => {
    setShowModal(true);
    setIsLogin(true);
    router.push("/loginPage");
  };

  const toggleSignupModal = () => {
    setShowModal(true);
    setIsLogin(false);
    router.push("/RegisterPage");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    router.push("/homePage");
    setShowDropdown(false);
    setUserData(null);
    setAuthtoken(null);
  };

  const { pathname } = router;

  const onMenuExpand = () => {
    setShowMenu(true);
  };

  const onMenuClose = () => {
    setShowMenu(false);
  };

  const onDropDownBtnClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        setShowDropdown
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (document) {
      document.body.style.overflow = showMenu ? "hidden" : "auto";
    }
  }, [showMenu]);

  return (
    <>
      {userData ? (
        // Display InnerNavbar if user is authenticated
        <InnerNavbar />
      ) : (
        // Display normal navbar if user is not authenticated
        <nav className={navmenu ? "active" : ""}>
            <Dltoggle />

            <ul className="normal-view-ul">
              {/* <li> */}
              <div className="logo1">
                <Link href="/homePage">
                  <h1>RVesting</h1>
                </Link>
              </div>
              {/* </li> */}
              <li className="hideOnMobile">
                <Link
                  href="/homePage"
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("home");
                  }}
                  className={isActive("home") ? "active" : ""}
                >
                  Home
                </Link>
              </li>
              <li className="hideOnMobile">
                <Link
                  href="/aboutPage"
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("about");
                  }}
                  className={isActive("about") ? "active" : ""}
                >
                  About
                </Link>
              </li>
              <li className="hideOnMobile">
                <Link
                  href="/aboutPage"
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("beststocks");
                  }}
                  className={isActive("beststocks") ? "active" : ""}
                >
                  Best Stocks
                </Link>
              </li>
              <li className="hideOnMobile">
                <Link
                  href="/aboutPage"
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("news");
                  }}
                  className={isActive("news") ? "active" : ""}
                >
                  News
                </Link>
              </li>

              <li className="hideOnMobile"><button className="navlogbtn" onClick={toggleLoginModal}>
                Login <FontAwesomeIcon icon={faArrowRight} />
              </button></li>

              <li className="hideOnMobile"><button className="navlogbtn" onClick={toggleSignupModal}>
                Signup <FontAwesomeIcon icon={faArrowRight} />
              </button></li>
              <li>
              <div className="mobile-menu-button" onClick={() => setsidebar(true)}><i className="fa fa-bars"></i></div>
              </li>
            </ul>
          <ul className={sidebar ? "mobile-view-ul" : "mobile-view-ul active"}>
            <li>
                  <div onClick={() => setsidebar(false)}><i className="fa fa-close"></i></div>
            </li>
            <li>
                <Link
                  href="/homePage"
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("home");
                  }}
                  className={isActive("home") ? "active" : ""}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/aboutPage"
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("about");
                  }}
                  className={isActive("about") ? "active" : ""}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/aboutPage"
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("beststocks");
                  }}
                  className={isActive("beststocks") ? "active" : ""}
                >
                  Best Stocks
                </Link>
              </li>
              <li>
                <Link
                  href="/aboutPage"
                  scroll={false}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("news");
                  }}
                  className={isActive("news") ? "active" : ""}
                >
                  News
                </Link>
              </li>
              <li>
              <button className="navlogbtn" onClick={toggleLoginModal}>
                Login <FontAwesomeIcon icon={faArrowRight} />
              </button>
              </li>
              <li>
              <button className="navlogbtn" onClick={toggleSignupModal}>
                Signup <FontAwesomeIcon icon={faArrowRight} />
              </button>
              </li>
              </ul>
        </nav>
      )}

      <AuthModal />
    </>
  );
}

export default Header;
