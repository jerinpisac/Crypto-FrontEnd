import React from "react";
import InnerHeader from "../components/InnerHeader";
import GeneticAlgo from "../components/GeneticAlgo";
import SentiNews from "../components/SentiNews";
import CandleStick from "../components/CandleStick";
import Chatbot from "../components/Chatbot";

function innovativePage() {
  return (
    <>
      <InnerHeader />
      <Chatbot />
      <GeneticAlgo />
      <CandleStick />
      <SentiNews />
    </>
  );
}

export default innovativePage;
