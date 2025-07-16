import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    // Log error to console (future: integrate with Sentry/LogRocket)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>We're sorry, but an unexpected error has occurred.</p>
          <button onClick={this.handleRefresh} style={{ margin: '16px 8px' }}>Refresh Page</button>
          <a href="mailto:support@example.com" style={{ margin: '16px 8px', color: '#007bff' }}>Contact Support</a>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{ color: 'red', marginTop: 24, textAlign: 'left', maxWidth: 600, margin: '24px auto' }}>
              {this.state.error.toString()}
              {'\n'}
              {this.state.errorInfo?.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 