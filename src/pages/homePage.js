import React, { useRef, useState, useEffect } from "react";
import Mainpage from "../components/Mainpage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import AboutPage from "../components/About";
import StockNews from "../components/StockNews";
import Chatbot from "../components/Chatbot";

function Homepage() {
  const homePageRef = useRef(null);
  const aboutPageRef = useRef(null);
  const cardPageRef = useRef(null);
  const newsPageRef = useRef(null);

  const [activeSection, setActiveSection] = useState("home");

  const sectionRefs = {
    home: homePageRef,
    about: aboutPageRef,
    beststocks: cardPageRef,
    news: newsPageRef,
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2; // Center of the viewport
    for (const section in sectionRefs) {
      const ref = sectionRefs[section].current;
      if (ref) {
        const { offsetTop, offsetHeight } = ref;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = (section) => {
    if (section === "home" && homePageRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (section === "about" && aboutPageRef.current) {
      aboutPageRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "beststocks" && cardPageRef.current) {
      cardPageRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (section === "news" && newsPageRef.current) {
      newsPageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />
      <div className="homepage">
        <Chatbot />
        <Mainpage ref={homePageRef} onExploreClick={scrollToSection} />
        <AboutPage ref={aboutPageRef} />
        <Cards ref={cardPageRef} />
        {/* <div className="stocknews" ref={newsPageRef}>
          <h1>Market News</h1>
          <StockNews />
        </div> */}
        <Footer />
      </div>
    </>
  );
}

export default Homepage;
