import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Widget from './Widget';
import Screen from './Screen';
import styles from './styles.module.css';

function App() {
  const [screen, setScreen] = useState(false);
  return (
    <main className={styles['example-standalone']}>
      <h1>Example standalone</h1>
      {screen ? (
        <Screen onBack={() => setScreen(false)} />
      ) : (
        <Widget onOpen={() => setScreen(true)} />
      )}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
