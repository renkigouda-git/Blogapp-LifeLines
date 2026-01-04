// src/components/settings/ToggleSwitch.jsx
import React from "react";

export default function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
}) {
  const toggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      className={`toggle-switch ${checked ? "on" : "off"} ${
        disabled ? "disabled" : ""
      }`}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <span className="knob" />
    </button>
  );
}
