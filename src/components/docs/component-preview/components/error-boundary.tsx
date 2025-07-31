"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ComponentErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Component Preview Error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Component Error</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Failed to render component preview
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="text-xs text-left max-w-md">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Show error details
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-red-600 overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button
            onClick={this.resetError}
            className="mt-4 px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}