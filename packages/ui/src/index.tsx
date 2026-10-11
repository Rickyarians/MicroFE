import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import './styles.css';

export function Button({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className="mfe-button" {...props}>{children}</button>;
}

export function Card({ children }: { children: ReactNode }) {
  return <section className="mfe-card">{children}</section>;
}
