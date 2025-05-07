import React, { use, useState } from "react";
import Link from "next/link";
import { useContext } from "react";
import UserContext from "../context/userContext";
import { Sidebar } from "flowbite-react";

function Profiledrop( { setDropmenu }, ref) {
  const { userData, handleLogout } = useContext(UserContext);
  console.log(userData);

  return (
    <>
    <div ref={ref} className="dropdownheader">
      <ul>
        <label>
          <img src="/img.jpg" alt="" />
          <h2>{userData?.name ? userData.name : null}</h2>
        </label>
        <hr />
        <li>
          <Link href="/profilePage">
            <i className="fa fa-user"></i>
            <h3>Profile</h3>
          </Link>
        </li>
        <li>
          <Link href="">
            <i className="fa fa-sign-out"></i>
            <h3 onClick={handleLogout}>Sign Out</h3>
          </Link>
        </li>
      </ul>
    </div>
    <div ref={ref} className="mobile-dropdownheader">
      <i id="close" className="fa fa-close" onClick={() => setDropmenu(false)}></i>
      <ul>
        <label>
          <img src="/img.jpg" alt="" />
          <h2>{userData?.name ? userData.name : null}</h2>
        </label>
        <hr />
          <li>
            <Link href="/explorePage" title="explore">
              <i className="fa fa-compass"></i>
              <h3>Explore</h3>
            </Link>
          </li>
          <li>
            <Link href="/transactionPage" title="Transactions">
              <i className="fa fa-money"></i>
              <h3>Transactions</h3>
            </Link>
          </li>
          <li>
            <Link href="/portfolioPage" title="portfolio">
              <i className="fa fa-folder-open"></i>
              <h3>Portfolio</h3>
            </Link>
          </li>
          <li>
            <Link href="/discussionPage" title="Discussion">
              <i className="fa fa-comments"></i>
              <h3>Discussion</h3>
            </Link>
          </li>
          <li>
            <Link href="/innovativePage" title="Innovation">
              <i className="fa fa-lightbulb-o"></i>
              <h3>Innovation</h3>
            </Link>
          </li>
          <li>
            <Link href="/profilePage">
              <i className="fa fa-user"></i>
              <h3>Profile</h3>
            </Link>
          </li>
          <li>
            <Link href="">
              <i className="fa fa-sign-out"></i>
              <h3 onClick={handleLogout}>Sign Out</h3>
            </Link>
          </li>
        </ul>
    </div>
  </>
  );
}

export default React.forwardRef(Profiledrop);
