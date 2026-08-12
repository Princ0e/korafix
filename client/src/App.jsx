import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import Jobs from './pages/Jobs';
import WorkerInfo from './pages/WorkerInfo';
import Workers from './pages/Workers';

// Simple Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Crash caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
              <span className="text-3xl font-bold">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-8">The application encountered an unexpected error. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Return to Home
            </button>
            {!import.meta.env.PROD && (
              <pre className="mt-8 p-4 bg-gray-900 text-red-400 text-xs text-left overflow-auto rounded-lg max-h-40">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hire" element={<PostJob />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/worker-info" element={<WorkerInfo />} />
              <Route path="/workers" element={<Workers />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} KoraFiks. {t('footer.rights')}
              </p>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
