"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class BookingErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Booking app error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="booking-shell booking-safe-screen">
          <section className="booking-safe-panel">
            <h1>Something went wrong, but your local booking data is safe.</h1>
            <p>Refresh or continue offline.</p>
            <button type="button" onClick={() => this.setState({ hasError: false })}>
              Continue
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
