"use client";

import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

type AvatarWebGLBoundaryProps = {
  children: ReactNode;
  fallback: (retry: () => void) => ReactNode;
  onFailure?: () => void;
  onRetry?: () => void;
};

type AvatarWebGLBoundaryState = {
  failed: boolean;
  retryKey: number;
};

export class AvatarWebGLBoundary extends Component<
  AvatarWebGLBoundaryProps,
  AvatarWebGLBoundaryState
> {
  state: AvatarWebGLBoundaryState = {
    failed: false,
    retryKey: 0,
  };

  static getDerivedStateFromError(): Partial<AvatarWebGLBoundaryState> {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Procedural avatar renderer failed.", error, info);
    this.props.onFailure?.();
  }

  retry = () => {
    this.props.onRetry?.();
    this.setState((current) => ({
      failed: false,
      retryKey: current.retryKey + 1,
    }));
  };

  render() {
    if (this.state.failed) return this.props.fallback(this.retry);
    return <div key={this.state.retryKey}>{this.props.children}</div>;
  }
}
