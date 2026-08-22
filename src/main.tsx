import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class AppErrorBoundary extends React.Component<React.PropsWithChildren, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#273f4f' }}>
          <h1>Haven Space n'a pas pu se charger</h1>
          <p>{this.state.error.message || 'Erreur JavaScript inconnue.'}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Recharger
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
