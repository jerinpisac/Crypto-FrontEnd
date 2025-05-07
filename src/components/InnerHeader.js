import React, { useState, useEffect, useRef } from "react";
import Dltoggle from "./Dltoggle";
import Link from "next/link";
import Profiledrop from "./Profiledrop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [dropmenu, setDropmenu] = useState(false);
  const [addshadow, setAddshadow] = useState(false);

  const iref = useRef();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        iref.current &&
        !iref.current.contains(e.target)
      ) {
        setDropmenu(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setAddshadow(true);
      } else {
        setAddshadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={addshadow ? "Navbar active" : "Navbar"}>
      <div className="navbarmenu">
        <div className="logo1">RVesting</div>
        <ul className="nodrop">
          <li>
            <Link href="/explorePage" title="explore">
              Explore
            </Link>
          </li>
          <li>
            <Link href="/transactionPage" title="Transactions">
              Transactions
            </Link>
          </li>
          <li>
            <Link href="/portfolioPage" title="portfolio">
              Portfolio
            </Link>
          </li>
          <li>
            <Link href="/discussionPage" title="Discussion">
              Discussion
            </Link>
          </li>
          <li>
            <Link href="/innovativePage" title="Innovation">
              Innovation
            </Link>
          </li>
        </ul>
        <i ref={iref} onClick={() => setDropmenu(!dropmenu)} id="landingdropmenu" title="Jerin">
          <FontAwesomeIcon icon={faBars} />
        </i>
      </div>
      <Dltoggle />
      {dropmenu && <Profiledrop ref={menuRef} setDropmenu={setDropmenu} />}
    </nav>
  );
}

export default Navbar;
