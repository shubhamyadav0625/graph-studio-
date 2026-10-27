// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center bg-[#090d24] border border-rose-900/60 rounded-2xl m-4 text-white">
          <div className="w-12 h-12 rounded-full bg-rose-950 flex items-center justify-center text-rose-400 mb-3 text-xl font-bold">
            !
          </div>
          <h2 className="text-base font-bold text-white mb-1">Rendering Encountered an Error</h2>
          <p className="text-xs text-slate-400 max-w-md mb-4 font-mono break-all">
            {this.state.error?.message || 'Unknown runtime error occurred.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
