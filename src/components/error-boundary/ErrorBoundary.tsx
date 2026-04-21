"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Finny } from "@/components/mascot/Finny";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <Finny size={120} pose="sad" className="mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Ada yang salah
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Sepertinya terjadi kesalahan. Jangan khawatir, progress kamu tetap aman!
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleReset} variant="primary">
              Coba Lagi
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Halaman
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mt-6 p-4 bg-red-50 text-red-800 text-left text-sm rounded-lg max-w-full overflow-auto">
              {this.state.error.message}
              {"\n"}
              {this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}