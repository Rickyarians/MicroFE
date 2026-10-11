import React, { Component, type ReactNode } from 'react';
import { Button, Card } from '@microfe/ui';

export default class RemoteBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <Card>
          <div role="alert">
            <h2>Modul tidak tersedia</h2>
            <p>Remote gagal dimuat. Anda tetap dapat menggunakan navigasi shell.</p>
            <Button onClick={() => window.location.reload()}>Muat ulang</Button>
          </div>
        </Card>
      );
    return this.props.children;
  }
}
