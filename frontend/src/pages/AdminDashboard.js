import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      navigate('/admin/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchStats();
  }, [user, token, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8" data-testid="admin-header">
          <h1 
            className="text-4xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
            data-testid="admin-welcome"
          >
            Admin Dashboard
          </h1>
          <p className="text-slate-600">Welcome, {user?.name}</p>
        </div>

        {loading ? (
          <p className="text-center text-slate-600">Loading statistics...</p>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8" data-testid="admin-stats">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
                <p className="text-sm text-slate-600 font-medium">Total Journals</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalJournals}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-600">
                <p className="text-sm text-slate-600 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
                <p className="text-sm text-slate-600 font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600">
                <p className="text-sm text-slate-600 font-medium">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-600">
                <p className="text-sm text-slate-600 font-medium">Total Students</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalStudents}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/admin/review')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold transition text-left"
                  data-testid="review-journals-btn"
                >
                  <span className="block text-sm opacity-90">Review Pending Journals</span>
                  <span className="block text-2xl font-bold">{stats.pending} waiting</span>
                </button>
                <button
                  onClick={() => navigate('/admin/review?status=approved')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition text-left"
                  data-testid="view-approved-btn"
                >
                  <span className="block text-sm opacity-90">View Approved Journals</span>
                  <span className="block text-2xl font-bold">{stats.approved} published</span>
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;