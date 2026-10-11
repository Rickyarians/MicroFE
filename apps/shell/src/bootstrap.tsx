import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import RemoteBoundary from './RemoteBoundary';
import './styles.css';

const Widget = lazy(() => import('example/Widget'));
const Screen = lazy(() => import('example/Screen'));
const getRoute = () => window.location.hash.slice(1) || '/';
const navigate = (route: string) => { window.location.hash = route; };

function App() {
  const [route, setRoute] = useState(getRoute);
  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return <div className="shell-layout">
    <header className="shell-header"><h1>MicroFE</h1><span>React + Module Federation</span></header>
    <nav className="shell-nav" aria-label="Navigasi utama">
      <a href="#/" aria-current={route === '/' ? 'page' : undefined}>Dashboard</a>
      <a href="#/example" aria-current={route === '/example' ? 'page' : undefined}>Example</a>
    </nav>
    <main className="shell-main">
      <p className="shell-eyebrow">MICROFRONTEND BOILERPLATE</p>
      <h2>{route === '/' ? 'Dashboard' : route === '/example' ? 'Example' : 'Halaman tidak ditemukan'}</h2>
      {(route === '/' || route === '/example') ? <RemoteBoundary key={route}>
        <Suspense fallback={<p role="status">Memuat modul…</p>}>
          {route === '/' ? <Widget onOpen={() => navigate('/example')} /> : <Screen onBack={() => navigate('/')} />}
        </Suspense>
      </RemoteBoundary> : <a href="#/">Kembali ke dashboard</a>}
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);
