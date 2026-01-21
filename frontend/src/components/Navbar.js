import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50" data-testid="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              NexeraWe Journals
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-amber-400 transition" data-testid="nav-home">Home</Link>
            
            {!user ? (
              <>
                <Link to="/login" className="hover:text-amber-400 transition" data-testid="nav-login">Login</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition" data-testid="nav-register">Register</Link>
              </>
            ) : (
              <>
                {user.role === 'student' ? (
                  <>
                    <Link to="/dashboard" className="hover:text-amber-400 transition" data-testid="nav-dashboard">Dashboard</Link>
                    <Link to="/upload" className="hover:text-amber-400 transition" data-testid="nav-upload">Upload Journal</Link>
                    <Link to="/my-porthole" className="hover:text-amber-400 transition" data-testid="nav-porthole">My Porthole</Link>
                  </>
                ) : (
                  <>
                    <Link to="/admin/dashboard" className="hover:text-amber-400 transition" data-testid="nav-admin-dashboard">Admin Dashboard</Link>
                    <Link to="/admin/review" className="hover:text-amber-400 transition" data-testid="nav-admin-review">Review</Link>
                  </>
                )}
                <button 
                  onClick={logout} 
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                  data-testid="nav-logout"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;