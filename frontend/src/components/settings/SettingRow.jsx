// src/components/settings/SettingRow.jsx
import React from "react";

export default function SettingRow({ icon, title, subtitle, right, children }) {
  // children can render custom control under the row if needed
  return (
    <div className="setting-row">
      <div className="setting-row-left">
        <div className="setting-row-icon">{icon}</div>
        <div>
          <div className="setting-row-title">{title}</div>
          {subtitle && <div className="setting-row-subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="setting-row-right">
        {right}
      </div>
      {children}
    </div>
  );
}
