import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';

const Home = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    college: '',
    department: '',
    keyword: '',
  });

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const params = new URLSearchParams();
      params.append('status', 'approved');
      if (filters.college) params.append('college', filters.college);
      if (filters.department) params.append('department', filters.department);
      if (filters.keyword) params.append('keyword', filters.keyword);

      const response = await axios.get(`${API}/journals?${params}`);
      setJournals(response.data.journals || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchJournals();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-24" data-testid="hero-section">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.pexels.com/photos/6280728/pexels-photo-6280728.jpeg" 
            alt="Academic Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
            data-testid="hero-title"
          >
            Academic Excellence,
            <br />
            <span className="text-amber-400">Digitally Published</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            A platform for college students to publish research papers and projects,
            contributing to the global academic community.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition"
              data-testid="hero-register-btn"
            >
              Start Publishing
            </Link>
            <Link
              to="#journals"
              className="bg-slate-700 hover:bg-slate-600 px-8 py-3 rounded-lg font-semibold text-lg transition"
              data-testid="hero-browse-btn"
            >
              Browse Journals
            </Link>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-slate-200 py-6" id="journals">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-testid="filter-section">
            <input
              type="text"
              name="college"
              placeholder="Filter by College"
              value={filters.college}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              data-testid="filter-college"
            />
            <input
              type="text"
              name="department"
              placeholder="Filter by Department"
              value={filters.department}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              data-testid="filter-department"
            />
            <input
              type="text"
              name="keyword"
              placeholder="Search by Keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              data-testid="filter-keyword"
            />
            <button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
              data-testid="apply-filters-btn"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Journals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 
          className="text-3xl md:text-4xl font-semibold mb-8 text-slate-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
          data-testid="published-journals-heading"
        >
          Published Journals
        </h2>

        {loading ? (
          <div className="text-center py-12" data-testid="loading-indicator">
            <p className="text-slate-600">Loading journals...</p>
          </div>
        ) : journals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200" data-testid="no-journals-message">
            <p className="text-slate-600">No journals found. Be the first to publish!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="journals-grid">
            {journals.map((journal) => (
              <div
                key={journal._id}
                className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                data-testid={`journal-card-${journal._id}`}
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 
                      className="text-xl font-semibold text-slate-900 line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {journal.title}
                    </h3>
                  </div>

                  <StatusBadge status={journal.status} />

                  <p className="text-slate-600 text-sm line-clamp-3">
                    {journal.abstract}
                  </p>

                  <div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-500">
                    <p><strong>Authors:</strong> {journal.authors.join(', ')}</p>
                    <p><strong>College:</strong> {journal.college}</p>
                    <p><strong>Department:</strong> {journal.department}</p>
                    {journal.keywords?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {journal.keywords.map((keyword, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/journal/${journal._id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition mt-4"
                    data-testid={`view-journal-btn-${journal._id}`}
                  >
                    View Journal
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-300">© 2026 NexeraWe Journals. All rights reserved.</p>
          <p className="text-slate-400 text-sm mt-2">journals.nexerawe.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;