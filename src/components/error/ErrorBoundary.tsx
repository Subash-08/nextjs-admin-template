'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CLIENT_ERROR]', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 my-4 border border-red-200 bg-red-50 rounded-md">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Component Error</h2>
          <p className="text-sm text-red-600 mb-4">
            We're sorry, but something went wrong while rendering this component.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="text-xs text-red-800 bg-red-100 p-2 rounded overflow-auto max-w-full">
              {this.state.error.message}
            </pre>
          )}
          <button
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
