import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Language } from '../types';
import { t } from '../i18n';

interface Props {
  children: ReactNode;
  language: Language;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const { language } = this.props;
      return (
        <div className="min-h-screen bg-paper flex items-center justify-center px-6">
          <div className="card max-w-md w-full p-8 text-center">
            <p className="font-serif text-2xl text-ink mb-3">
              {t('somethingWentWrong', language)}
            </p>
            <p className="text-ink-muted text-sm mb-6 leading-relaxed">
              {t('errorHint', language)}
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              {t('reloadPage', language)}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
