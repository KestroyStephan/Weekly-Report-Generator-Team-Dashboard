import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 24px',
          margin: '32px auto',
          maxWidth: '600px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-card-border)',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={24} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
            Something went wrong loading this view
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '440px' }}>
            {this.state.error?.message || "An unexpected error occurred while rendering the page component."}
          </p>
          <Button variant="primary" icon={RefreshCw} onClick={this.handleReset}>
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
