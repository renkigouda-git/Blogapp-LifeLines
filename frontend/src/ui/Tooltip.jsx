import React from "react";
import "./Tooltip.css";

export default function Tooltip({ children, text, position = "top" }) {
  return (
    <div className="tooltip-container">
      {children}
      <span className={`tooltip-box tooltip-${position}`}>
        {text}

        <span className={`tooltip-arrow tooltip-arrow-${position}`}></span>
      </span>
    </div>
  );
}
