import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';

const StudentPorthole = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPorthole();
  }, [id]);

  const fetchPorthole = async () => {
    try {
      const response = await axios.get(`${API}/students/${id}/porthole`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching porthole:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-red-600">Student not found</p>
        </div>
      </div>
    );
  }

  const { student, journals, stats } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200 py-12" data-testid="porthole-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {student.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 
                className="text-4xl font-bold text-slate-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
                data-testid="porthole-student-name"
              >
                {student.name}
              </h1>
              <p className="text-lg text-slate-600">
                {student.college} | {student.department} | {student.year}
              </p>
              <p className="text-sm text-slate-500 mt-2">{student.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12" data-testid="porthole-stats">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border-t-4 border-blue-600">
            <p className="text-sm text-slate-600 font-medium">Total Journals</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalJournals}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border-t-4 border-green-600">
            <p className="text-sm text-slate-600 font-medium">Published</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border-t-4 border-yellow-600">
            <p className="text-sm text-slate-600 font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border-t-4 border-amber-600">
            <p className="text-sm text-slate-600 font-medium">Member Since</p>
            <p className="text-lg font-bold text-slate-900 mt-2">
              {new Date(student.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Journals */}
        <div className="bg-white rounded-lg shadow-sm p-8" data-testid="porthole-journals">
          <h2 
            className="text-3xl font-semibold text-slate-900 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Published Work
          </h2>

          {journals.length === 0 ? (
            <p className="text-center text-slate-600 py-12">No journals published yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
                  data-testid={`porthole-journal-${journal.id}`}
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {journal.title}
                  </h3>
                  
                  <StatusBadge status={journal.status} />

                  <p className="text-slate-600 text-sm mt-3 line-clamp-3">
                    {journal.abstract}
                  </p>

                  <div className="mt-4 text-sm text-slate-500 space-y-1">
                    <p><strong>ID:</strong> {journal.publicationId}</p>
                    <p><strong>Downloads:</strong> {journal.downloadCount}</p>
                    <p><strong>Published:</strong> {new Date(journal.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPorthole;