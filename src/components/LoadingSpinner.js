import React from "react";

const LoadingSpinner = () => {
  const spinnerContainerStyle = {
    textAlign: "center",
    margin: "24px 0", // Equivalent to `my-6`
  };

  const spinnerStyle = {
    display: "inline-block",
    width: "32px", // Equivalent to `w-8`
    height: "32px", // Equivalent to `h-8`
    marginRight: "8px", // Equivalent to `mr-2`
    border: "4px solid #f3f3f3", // Equivalent to `text-gray-200`
    borderRadius: "50%",
    borderTop: "4px solid #bbf7d0", // Equivalent to `fill-lime-200`
    animation: "spin 1s linear infinite",
  };

  return (
    <div style={spinnerContainerStyle}>
      <div role="status">
        <div style={spinnerStyle}></div>
        <span
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
          }}
        >
          Loading...
        </span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
