import React from 'react';
import { Button, Card } from '@microfe/ui';
import type { ScreenProps } from '@microfe/contracts';
import './styles.css';

export default function Screen({ onBack }: ScreenProps) {
  return <Card>
    <p className="example-label">EXAMPLE / SCREEN</p>
    <h2>Screen dari remote</h2>
    <p>Remote memiliki konten screen. Shell memiliki layout dan navigasi.</p>
    <Button onClick={onBack}>Kembali ke dashboard</Button>
  </Card>;
}
