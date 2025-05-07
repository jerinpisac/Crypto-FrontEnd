import React from "react";
import Link from "next/link";

const GeneticAlgo = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "200px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        className="genalbody"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to right, #e0f7fa, #b3e5fc, #81d4fa)",
          borderRadius: "20px",
        }}
      >
      <Link
        className="genallink"
        href="http://localhost:8501/"
        style={{
          textDecoration: "none",
          padding: "12px 24px",
          fontWeight: "bold",
          color: "#fff",
          backgroundColor: "#0077cc",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#005fa3";
          e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#0077cc";
          e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        }}
      >
        Genetic Algorithm Dashboard
      </Link>
      </div>
    </div>
  );
};

export default GeneticAlgo;
