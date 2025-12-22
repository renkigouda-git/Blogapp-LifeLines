// src/components/settings/ToggleSwitch.jsx
import React from "react";

export default function ToggleSwitch({ checked = false, onChange, disabled = false }) {
  return (
    <button
      className={`toggle-switch ${checked ? "on" : "off"} ${disabled ? "disabled" : ""}`}
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange && onChange(!checked)}
      type="button"
    >
      <span className="knob" />
    </button>
  );
}
