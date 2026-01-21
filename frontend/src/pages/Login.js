import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const isAdminLogin = location.pathname === '/admin/login';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isAdminLogin ? '/auth/admin-login' : '/auth/login';
      const response = await axios.post(`${API}${endpoint}`, formData);

      if (response.data.success) {
        toast.success('Login successful!');
        login(response.data.token, response.data.user);
        
        if (isAdminLogin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
          {/* Image Side */}
          <div className="hidden lg:block">
            <img
              src="https://images.pexels.com/photos/33733645/pexels-photo-33733645.jpeg"
              alt="Student"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Form Side */}
          <div className="bg-white rounded-lg shadow-lg p-8" data-testid="login-form-container">
            <h1 
              className="text-4xl font-bold text-slate-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
              data-testid="login-heading"
            >
              {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
            </h1>
            <p className="text-slate-600 mb-8">
              {isAdminLogin ? 'Sign in to manage journals' : 'Sign in to your account'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  data-testid="login-email-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  data-testid="login-password-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold transition"
                data-testid="login-submit-btn"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {!isAdminLogin && (
              <p className="text-center text-slate-600 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Register here
                </Link>
              </p>
            )}

            {isAdminLogin && (
              <p className="text-center text-slate-600 mt-6 text-sm">
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Student Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;