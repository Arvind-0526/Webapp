import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      navigate('/admin/dashboard');
      return;
    }
    fetchMyJournals();
  }, [user, token, navigate]);

  const fetchMyJournals = async () => {
    try {
      const response = await axios.get(`${API}/journals/my/journals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(response.data.journals || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: journals.length,
    pending: journals.filter(j => j.status === 'pending').length,
    approved: journals.filter(j => j.status === 'approved').length,
    rejected: journals.filter(j => j.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8" data-testid="dashboard-header">
          <h1 
            className="text-4xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
            data-testid="dashboard-welcome"
          >
            Welcome, {user?.name}
          </h1>
          <p className="text-slate-600">{user?.college} | {user?.department} | {user?.year}</p>
          <p className="text-sm text-slate-500 mt-2">{user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-testid="stats-cards">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
            <p className="text-sm text-slate-600 font-medium">Total Journals</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
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
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/upload')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            data-testid="upload-new-journal-btn"
          >
            + Upload New Journal
          </button>
        </div>

        {/* My Journals */}
        <div className="bg-white rounded-lg shadow-sm p-8" data-testid="my-journals-section">
          <h2 
            className="text-2xl font-semibold text-slate-900 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            My Journals
          </h2>

          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : journals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">You haven't uploaded any journals yet.</p>
              <button
                onClick={() => navigate('/upload')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Upload Your First Journal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {journals.map((journal) => (
                <div
                  key={journal._id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
                  data-testid={`journal-item-${journal._id}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {journal.title}
                      </h3>
                      <StatusBadge status={journal.status} />
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {journal.abstract}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div>
                      <span><strong>ID:</strong> {journal.publicationId}</span>
                      <span className="ml-4"><strong>Downloads:</strong> {journal.downloadCount}</span>
                    </div>
                    <div>
                      <span>{new Date(journal.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {journal.adminNotes && (
                    <div className="mt-4 bg-slate-50 p-3 rounded border border-slate-200">
                      <p className="text-xs font-medium text-slate-700">Admin Notes:</p>
                      <p className="text-sm text-slate-600">{journal.adminNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;