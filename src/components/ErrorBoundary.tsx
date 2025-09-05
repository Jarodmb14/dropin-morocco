import React, { Component, ErrorInfo, ReactNode } from 'react';
import SimpleHeader from './SimpleHeader';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen" style={{ backgroundColor: '#F2E4E5' }}>
          <SimpleHeader />
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
            <div className="max-w-md w-full text-center space-y-8">
              <div className="text-6xl mb-6">⚠️</div>
              <h2 className="text-4xl font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={this.handleRetry}
                  className="text-white px-8 py-4 font-semibold text-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wide"
                  style={{ 
                    fontFamily: 'Space Grotesk, sans-serif',
                    backgroundColor: '#E3BFC0'
                  }}
                >
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="block w-full border-2 border-gray-800 text-gray-800 bg-white px-8 py-4 font-semibold text-lg hover:bg-gray-50 transition-all duration-200 uppercase tracking-wide"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Go Home
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-700" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
