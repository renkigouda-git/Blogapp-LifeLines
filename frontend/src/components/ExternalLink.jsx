import React from 'react';

export default function ExternalLink({ href, children, className = '' }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className || 'link'}
    >
      {children || href} ↗
    </a>
  );
}
