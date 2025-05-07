import chroma from "chroma-js";
import React, { useContext, useState } from "react";
import { PieChart, Pie, Sector, Cell, Tooltip, Legend } from "recharts";
import UserContext from "../context/userContext";

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const PiechartComponent = ({ portfolioValue, tokens }) => {
  const { userData } = useContext(UserContext);

  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = (_, index) => {
    setActiveIndex(null);
  };

  let tokenData = tokens.sort(
    (a, b) => b.quantity * b.price.inr - a.quantity * a.price.inr
  );
  tokenData.map((t) => {
    t.value = t.quantity * t.price.inr;
  });

  let length = tokenData.length;

  const baseColor = "#ECFCCB";
  const numSteps = length;
  let colors = chroma
    .scale([baseColor, chroma(baseColor).saturate(2)])
    .colors(numSteps);
  colors = colors.reverse();

  const renderColorfulLegendText = (value, entry) => {
    return <span className="text-gray-500 ms-3">{value}</span>;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const color = payload[0].payload.fill;
      const total = portfolioValue;
      const value = payload[0].payload.value;
      const percent = ((value / total) * 100).toFixed(1);

      const tooltipStyle = {
        backgroundColor: "rgba(28, 28, 30, 0.6)",
        padding: "5px",
        border: "1px solid rgba(58, 58, 60, 1)",
        backdropFilter: "blur(8px)",
        borderRadius: "8px",
      };

      const percentageStyle = {
        display: "flex",
        alignItems: "center",
        color: "white",
        marginBottom: "8px",
      };

      const dotStyle = {
        height: "12px",
        width: "12px",
        borderRadius: "50%",
        backgroundColor: color,
        marginRight: "8px",
      };

      const coinStyle = {
        color: "white",
        fontWeight: "500",
        fontSize: "14px",
      };

      const symbolStyle = {
        color: "gray",
        marginLeft: "4px",
      };

      const quantityStyle = {
        color: "gray",
        fontWeight: "500",
        fontSize: "14px",
        marginTop: "8px",
      };

      return (
        <div style={tooltipStyle}>
          <div style={percentageStyle}>
            <div style={dotStyle}></div>
            <p style={{ fontSize: "14px", fontWeight: "500" }}>{percent}%</p>
          </div>
          <p style={coinStyle}>
            {payload[0].payload.name}
            <span style={symbolStyle}>
              {formatFloat(payload[0].payload.quantity, 3)}
              {payload[0].payload.symbol.toUpperCase()}
            </span>
          </p>
          <p style={quantityStyle}>
            {formatFloat(value)}INR
          </p>
        </div>
      );
    }

    return null;
  };

  const formatFloat = (number, toFixedN) => {
    const doubleNumber = Number(number);

    if (isNaN(doubleNumber)) {
      throw new Error("Invalid number provided");
    }

    return parseFloat(doubleNumber.toFixed(toFixedN)).toLocaleString("en-IN");
  };

  return (
    <div>
      <PieChart width={400} height={400} className="piechart">
        <Pie
          data={tokenData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={65}
          startAngle={90}
          endAngle={-360}
          minAngle={2}
          paddingAngle={2}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {tokenData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} stroke="#27272A" />
          ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip />}
          offset={36}
          isAnimationActive={true}
        />
        <Legend
          layout="vertical"
          align="center"
          verticalAlign="bottom"
          iconType="circle"
          formatter={renderColorfulLegendText}
        />
      </PieChart>
    </div>
  );
};

export default PiechartComponent;
