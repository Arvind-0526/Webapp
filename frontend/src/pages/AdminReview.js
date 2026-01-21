import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';

const AdminReview = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('status') || 'pending');
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate('/admin/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchJournals();
  }, [user, token, navigate, filter]);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/admin/journals?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(response.data.journals || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (journalId) => {
    setActionLoading(true);
    try {
      const response = await axios.put(
        `${API}/admin/journals/${journalId}/approve`,
        { adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Journal approved! Email sent to student.');
        setSelectedJournal(null);
        setAdminNotes('');
        fetchJournals();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve journal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (journalId) => {
    if (!adminNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      const response = await axios.put(
        `${API}/admin/journals/${journalId}/reject`,
        { adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Journal rejected');
        setSelectedJournal(null);
        setAdminNotes('');
        fetchJournals();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject journal');
    } finally {
      setActionLoading(false);
    }
  };

  const openPDF = (pdfPath) => {
    const pdfUrl = `${process.env.REACT_APP_BACKEND_URL}${pdfPath}`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 
          className="text-4xl font-bold text-slate-900 mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
          data-testid="review-heading"
        >
          Review Journals
        </h1>

        {/* Filter Tabs */}
        <div className="mb-6 flex space-x-2" data-testid="filter-tabs">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
            data-testid="filter-pending"
          >
            Pending ({journals.filter(j => j.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'approved'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
            data-testid="filter-approved"
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'rejected'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
            data-testid="filter-rejected"
          >
            Rejected
          </button>
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === ''
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
            data-testid="filter-all"
          >
            All
          </button>
        </div>

        {/* Journals List */}
        {loading ? (
          <p className="text-center text-slate-600">Loading journals...</p>
        ) : journals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-slate-600">No journals found</p>
          </div>
        ) : (
          <div className="space-y-4" data-testid="journals-list">
            {journals.map((journal) => (
              <div
                key={journal._id}
                className="bg-white rounded-lg shadow-sm p-6 border border-slate-200"
                data-testid={`review-journal-${journal._id}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Journal Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          {journal.title}
                        </h3>
                        <StatusBadge status={journal.status} />
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {journal.abstract}
                    </p>

                    <div className="text-sm text-slate-600 space-y-1">
                      <p><strong>Authors:</strong> {journal.authors?.join(', ')}</p>
                      <p><strong>Primary:</strong> {journal.primaryAuthor}</p>
                      <p><strong>College:</strong> {journal.college}</p>
                      <p><strong>Department:</strong> {journal.department}</p>
                      <p><strong>Student:</strong> {journal.uploadedBy?.name} ({journal.uploadedBy?.email})</p>
                      <p><strong>Publication ID:</strong> {journal.publicationId}</p>
                      <p><strong>Submitted:</strong> {new Date(journal.createdAt).toLocaleDateString()}</p>
                    </div>

                    <button
                      onClick={() => openPDF(journal.pdfPath)}
                      className="mt-4 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      data-testid={`view-pdf-btn-${journal._id}`}
                    >
                      View PDF
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1">
                    {journal.status === 'pending' ? (
                      selectedJournal === journal._id ? (
                        <div className="space-y-4">
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add notes (optional for approval, required for rejection)"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            rows={4}
                            data-testid="admin-notes-textarea"
                          />
                          <div className="space-y-2">
                            <button
                              onClick={() => handleApprove(journal._id)}
                              disabled={actionLoading}
                              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white py-2 rounded-lg font-medium transition"
                              data-testid={`approve-btn-${journal._id}`}
                            >
                              {actionLoading ? 'Processing...' : 'Approve & Send Email'}
                            </button>
                            <button
                              onClick={() => handleReject(journal._id)}
                              disabled={actionLoading}
                              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white py-2 rounded-lg font-medium transition"
                              data-testid={`reject-btn-${journal._id}`}
                            >
                              {actionLoading ? 'Processing...' : 'Reject'}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedJournal(null);
                                setAdminNotes('');
                              }}
                              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg font-medium transition"
                              data-testid="cancel-btn"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedJournal(journal._id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                          data-testid={`review-action-btn-${journal._id}`}
                        >
                          Review This Journal
                        </button>
                      )
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-slate-700 mb-2">Status</p>
                        <p className="text-sm text-slate-600 capitalize">{journal.status}</p>
                        {journal.adminNotes && (
                          <>
                            <p className="text-sm font-medium text-slate-700 mt-3 mb-1">Admin Notes</p>
                            <p className="text-sm text-slate-600">{journal.adminNotes}</p>
                          </>
                        )}
                        {journal.approvedAt && (
                          <>
                            <p className="text-sm font-medium text-slate-700 mt-3 mb-1">Approved On</p>
                            <p className="text-sm text-slate-600">
                              {new Date(journal.approvedAt).toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReview;