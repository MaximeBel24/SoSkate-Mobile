import React from "react";
import { logger } from "@/src/shared/utils/logger";

interface Props {
  children: React.ReactNode;
  FallbackComponent: React.ComponentType<{ error: Error; onReset: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(error);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <this.props.FallbackComponent
          error={this.state.error}
          onReset={this.resetError}
        />
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
