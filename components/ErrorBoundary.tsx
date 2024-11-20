import ErrorScreen from "@/app/error/error";
import React, { Component, ReactNode } from "react";

type ErrorBoundaryProps = {
    children: ReactNode;
  };
  
  type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
  };
  
  export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false, error: null };
    }
  
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      // Update state sehingga UI bisa menunjukkan fallback UI
      return { hasError: true, error };
    }
  
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
      // Anda bisa melaporkan error ke layanan monitoring seperti Sentry di sini
    }
  
    resetErrorBoundary = () => {
      this.setState({ hasError: false, error: null });
    };
  
    render() {
      if (this.state.hasError && this.state.error) {
        return (
          <ErrorScreen
            error={this.state.error} // Dijamin tidak null
            resetErrorBoundary={this.resetErrorBoundary}
          />
        );
      }
  
      return this.props.children;
    }
  }