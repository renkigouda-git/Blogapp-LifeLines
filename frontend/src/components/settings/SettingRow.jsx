// src/components/settings/SettingRow.jsx
import React from "react";

export default function SettingRow({ icon, title, subtitle, right, children }) {
  return (
    <div className="setting-row">
      <div className="setting-row-left">
        {icon && <div className="setting-row-icon">{icon}</div>}

        <div className="setting-row-text">
          <div className="setting-row-title">{title}</div>
          {subtitle && (
            <div className="setting-row-subtitle">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div className="setting-row-right">
        {right}
      </div>

      {children}
    </div>
  );
}
