import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import styles from './styles.module.css';

export function Button({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={styles['mfe-button']} {...props}>
      {children}
    </button>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <section className={styles['mfe-card']}>{children}</section>;
}
