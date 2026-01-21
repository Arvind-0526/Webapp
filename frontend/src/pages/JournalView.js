import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';

const JournalView = () => {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJournal();
  }, [id]);

  const fetchJournal = async () => {
    try {
      const response = await axios.get(`${API}/journals/${id}`);
      setJournal(response.data.journal);
    } catch (error) {
      console.error('Error fetching journal:', error);
      toast.error('Failed to load journal');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (journal?.pdfPath) {
      const pdfUrl = `${process.env.REACT_APP_BACKEND_URL}${journal.pdfPath}`;
      window.open(pdfUrl, '_blank');
      toast.success('Opening PDF...');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-slate-600">Loading journal...</p>
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-red-600">Journal not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8" data-testid="journal-content">
              <h1 
                className="text-4xl font-bold text-slate-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
                data-testid="journal-title"
              >
                {journal.title}
              </h1>

              <div className="mb-6">
                <StatusBadge status={journal.status} />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Abstract</h3>
                  <p className="text-slate-700 leading-relaxed">{journal.abstract}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Authors</h3>
                  <p className="text-slate-700">
                    <strong>Primary:</strong> {journal.primaryAuthor}
                  </p>
                  <p className="text-slate-700">
                    <strong>Contributors:</strong> {journal.authors.join(', ')}
                  </p>
                </div>

                {journal.keywords?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {journal.keywords.map((keyword, idx) => (
                        <span 
                          key={idx} 
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24" data-testid="journal-sidebar">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Details</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600">Publication ID</p>
                  <p className="font-medium text-slate-900">{journal.publicationId}</p>
                </div>

                <div>
                  <p className="text-slate-600">College</p>
                  <p className="font-medium text-slate-900">{journal.college}</p>
                </div>

                <div>
                  <p className="text-slate-600">Department</p>
                  <p className="font-medium text-slate-900">{journal.department}</p>
                </div>

                <div>
                  <p className="text-slate-600">Year</p>
                  <p className="font-medium text-slate-900">{journal.year}</p>
                </div>

                <div>
                  <p className="text-slate-600">Published Date</p>
                  <p className="font-medium text-slate-900">
                    {new Date(journal.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-slate-600">Downloads</p>
                  <p className="font-medium text-slate-900">{journal.downloadCount}</p>
                </div>

                {journal.uploadedBy && (
                  <div>
                    <p className="text-slate-600">Uploaded By</p>
                    <p className="font-medium text-slate-900">{journal.uploadedBy.name}</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition mt-6"
                data-testid="download-pdf-btn"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalView;