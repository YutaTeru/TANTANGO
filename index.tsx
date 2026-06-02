import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log("VocabMaster: Entry point reached");

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', color: '#be123c', backgroundColor: '#fff1f2', border: '3px solid #f43f5e', borderRadius: '16px', margin: '24px', fontFamily: 'monospace', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontWeight: '900', fontSize: '20px', marginBottom: '12px' }}>🚨 Rendering Error Caught</h2>
          <p style={{ fontWeight: 'bold' }}>We encountered an error rendering the app:</p>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', backgroundColor: '#ffe4e6', padding: '12px', borderRadius: '8px', border: '1px solid #fecdd3' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px', color: '#9f1239', marginTop: '12px', overflowX: 'auto' }}>{this.state.error?.stack}</pre>
          <button 
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              if ('caches' in window) {
                caches.keys().then((names) => {
                  for (let name of names) caches.delete(name);
                });
              }
              window.location.reload();
            }}
            style={{ marginTop: '16px', padding: '10px 16px', backgroundColor: '#be123c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Data & Force Reset App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log("VocabMaster: Mounting React root...");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);