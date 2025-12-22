import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ to = -1, label = 'Back', className = '' }) {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() => nav(to)}
      className={`btn btn-ghost back-btn ${className}`}
      aria-label="Go back"
    >
      ← {label}
    </button>
  );
}
