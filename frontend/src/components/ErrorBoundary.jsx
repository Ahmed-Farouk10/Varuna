import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full mx-4 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 font-cool">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're working on fixing this. Please try again in a moment.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 