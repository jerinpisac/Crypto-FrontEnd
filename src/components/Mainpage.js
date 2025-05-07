import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function MainPage(props, ref) {
  const { onExploreClick } = props;

  return (
    <div ref={ref} className="mainpage">
      <div className="mid">
        <div className="head">
          <ul>
            <li>
              <label>Portfolio</label>
            </li>
            <li>
              <label>Management System</label>
            </li>
          </ul>
        </div>
        <div className="subhead">
          <label>
            A revolutionary digital solution for managing <br />your portfolio for
            Stocks and Crypto
          </label>
        </div>
        <div className="buttons">
        <Link
          href="/about"
          scroll={false}
          onClick={(e) => {
            e.preventDefault();
            onExploreClick("about");
          }}
        >
          <button className="exp">Explore</button>
        </Link>
        <Link href="/RegisterPage">
          <button className="lgs">
            Let's Get Started
            <i>
              <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
            </i>
          </button>
        </Link>
        </div>
      </div>
      <div className="image">
        <img src="/open.jpg" alt="Logo" />
      </div>
    </div>
  );
}

export default React.forwardRef(MainPage);
