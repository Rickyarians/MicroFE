import React, { useState } from 'react';
import { Button, Card } from '@microfe/ui';
import type { WidgetProps } from '@microfe/contracts';
import styles from './styles.module.css';

export default function Widget({ onOpen }: WidgetProps) {
  const [count, setCount] = useState(0);
  return (
    <Card>
      <p className={styles['example-label']}>EXAMPLE / WIDGET</p>
      <h2>Widget dari remote</h2>
      <p>Komponen ini dimuat dari aplikasi example. State interaksinya dikelola oleh remote.</p>
      <div className={styles['example-actions']}>
        <Button onClick={() => setCount((value) => value + 1)}>Klik: {count}</Button>
        <Button onClick={onOpen}>Buka screen remote</Button>
      </div>
    </Card>
  );
}
