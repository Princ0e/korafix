import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import Jobs from './pages/Jobs';

function App() {
  return (
    <Router>
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
            {/* <Route path="/categories" element={<CategoryList />} /> */}
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
            &copy; {new Date().getFullYear()} KoraFix. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
