import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import LegalAgreement from '@/components/LegalAgreement';
import { toast } from 'sonner';

const UploadJournal = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: '',
    primaryAuthor: user?.name || '',
    keywords: '',
    visibility: 'public',
    agreementAccepted: false,
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        toast.error('File size must be less than 15MB');
        return;
      }
      setPdfFile(file);
      
      // Generate filename preview
      const title = formData.title || 'journal-title';
      const studentName = user?.name || 'student-name';
      const timestamp = Date.now();
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const cleanName = studentName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const preview = `${cleanTitle}_${cleanName}_${timestamp}.pdf`;
      setFilePreview(preview);
    }
  };

  const handleAgreementChange = (checked) => {
    setFormData({ ...formData, agreementAccepted: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      toast.error('Please upload a PDF file');
      return;
    }

    if (!formData.agreementAccepted) {
      toast.error('You must accept the agreement to upload');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('pdf', pdfFile);
      uploadData.append('title', formData.title);
      uploadData.append('abstract', formData.abstract);
      uploadData.append('authors', formData.authors);
      uploadData.append('primaryAuthor', formData.primaryAuthor);
      uploadData.append('keywords', formData.keywords);
      uploadData.append('visibility', formData.visibility);
      uploadData.append('agreementAccepted', formData.agreementAccepted);

      const response = await axios.post(`${API}/journals/upload`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Journal uploaded successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8" data-testid="upload-form-container">
          <h1 
            className="text-4xl font-bold text-slate-900 mb-2 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
            data-testid="upload-heading"
          >
            Upload Journal
          </h1>
          <p className="text-slate-600 text-center mb-8">
            Share your research with the academic community
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Journal Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                data-testid="upload-title-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Abstract *
              </label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                data-testid="upload-abstract-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Authors / Contributors * (comma-separated)
              </label>
              <input
                type="text"
                name="authors"
                value={formData.authors}
                onChange={handleChange}
                required
                placeholder="e.g., John Doe, Jane Smith, Alice Johnson"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                data-testid="upload-authors-input"
              />
              <p className="text-xs text-slate-500 mt-1">
                List all team members who contributed to this project
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Primary Author *
              </label>
              <input
                type="text"
                name="primaryAuthor"
                value={formData.primaryAuthor}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                data-testid="upload-primary-author-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="e.g., Machine Learning, Data Science, AI"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                data-testid="upload-keywords-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Visibility *
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                data-testid="upload-visibility-select"
              >
                <option value="public">Public (visible after approval)</option>
                <option value="private">Private (only accessible via secure link)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload PDF * (Max 15MB)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                  data-testid="upload-pdf-input"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  {pdfFile ? pdfFile.name : 'Click to upload PDF'}
                </label>
                {filePreview && (
                  <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200" data-testid="filename-preview">
                    <p className="text-xs font-medium text-blue-900">File will be saved as:</p>
                    <p className="text-sm text-blue-700 font-mono break-all">{filePreview}</p>
                  </div>
                )}
              </div>
            </div>

            <LegalAgreement 
              checked={formData.agreementAccepted}
              onChange={handleAgreementChange}
              type="upload"
            />

            <button
              type="submit"
              disabled={loading || !formData.agreementAccepted || !pdfFile}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold transition"
              data-testid="upload-submit-btn"
            >
              {loading ? 'Uploading...' : 'Upload Journal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadJournal;