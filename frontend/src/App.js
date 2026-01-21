import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import '@/App.css';

import Home from '@/pages/Home';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import StudentDashboard from '@/pages/StudentDashboard';
import UploadJournal from '@/pages/UploadJournal';
import JournalView from '@/pages/JournalView';
import StudentPorthole from '@/pages/StudentPorthole';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminReview from '@/pages/AdminReview';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Toaster position="top-right" richColors />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/journal/:id" element={<JournalView />} />
            <Route path="/student/:id/porthole" element={<StudentPorthole />} />
            
            {/* Student Routes */}
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/upload" element={<UploadJournal />} />
            <Route path="/my-porthole" element={<StudentDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/review" element={<AdminReview />} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;