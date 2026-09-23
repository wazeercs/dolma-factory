import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log للأخطاء (يمكن إرسالها لـ Sentry لاحقاً)
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-4xl">
              ⚠️
            </div>
            <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
              حدث خطأ غير متوقع
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              نعتذر عن الإزعاج. يمكنك إعادة تحميل الصفحة أو العودة للرئيسية.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-right bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <summary className="cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-200">
                  تفاصيل الخطأ (للمطور)
                </summary>
                <pre className="text-xs text-red-600 dark:text-red-400 mt-2 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-teal-700 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform"
              >
                🔄 إعادة تحميل
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold active:scale-95 transition-transform"
              >
                🏠 الرئيسية
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
