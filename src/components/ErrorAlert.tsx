import React from 'react';
import { AlertCircle, X, RotateCcw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss, onRetry }) => {
  return (
    <div
      id="error-alert-banner"
      role="alert"
      className="w-full bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-xl p-4 shadow-xl backdrop-blur-md transition-all animate-fadeIn mb-6"
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5 border border-rose-500/30">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-rose-100">Search Notification</h4>
          <p className="text-sm text-rose-200/90 mt-0.5">{message}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onRetry && (
            <button
              id="error-retry-btn"
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
          {onDismiss && (
            <button
              id="error-dismiss-btn"
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss error"
              className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
