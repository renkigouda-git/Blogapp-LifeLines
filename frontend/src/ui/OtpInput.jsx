import React, { useRef } from "react";

export default function OtpInput({ value = "", onChange, length = 6 }) {
  const inputsRef = useRef([]);

  const handleChange = (e, i) => {
    const v = e.target.value.replace(/\D/g, "");
    if (!v) return;

    const chars = value.split("");
    chars[i] = v[0];
    onChange(chars.join("").slice(0, length));

    if (i < length - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const chars = value.split("");

      if (chars[i]) {
        chars[i] = "";
        onChange(chars.join(""));
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        chars[i - 1] = "";
        onChange(chars.join(""));
      }
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, marginTop: ".6rem" }}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          className="otp-box"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}
