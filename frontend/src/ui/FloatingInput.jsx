import React from "react";
import "./FloatingInput.css";

export default function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  style = {},
  ...props
}) {
  return (
    <div className="fi-group" style={style}>
      <input
        className="fi-input"
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
      <label className={value ? "fi-label filled" : "fi-label"}>
        {label}
      </label>
    </div>
  );
}
