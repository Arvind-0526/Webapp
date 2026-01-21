import React from 'react';

const LegalAgreement = ({ checked, onChange, type = 'register' }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4" data-testid="legal-agreement-container">
      <h3 className="text-lg font-semibold text-slate-900">
        Project Submission & Publication Agreement
      </h3>
      
      <div className="text-sm text-slate-700 space-y-3 max-h-64 overflow-y-auto">
        <p>
          By checking this box, I (the "Author") agree to the following terms with NexeraWe:
        </p>

        <div>
          <strong>Ownership & Authority:</strong>
          <p>
            I confirm that I am the original creator of this project and that I hold the full rights to this content.
            If this was a group project, I confirm I have obtained written permission from all teammates to publish this work.
          </p>
        </div>

        <div>
          <strong>Grant of License:</strong>
          <p>
            I grant NexeraWe a non-exclusive, worldwide, royalty-free license to host, display, and share my project
            on their website and promotional materials. I retain full ownership of my work.
          </p>
        </div>

        <div>
          <strong>Academic Integrity:</strong>
          <p>
            I acknowledge that I have checked my University's policy regarding external publication.
            I understand that publishing this work on NexeraWe may prevent me from submitting it to certain formal
            academic journals or competitions that require "previously unpublished" content.
          </p>
        </div>

        <div>
          <strong>Accuracy of Information:</strong>
          <p>
            I certify that the data and results presented in my project are authentic and not plagiarized.
          </p>
        </div>

        <div>
          <strong>Certification:</strong>
          <p>
            I understand that any certificate issued by NexeraWe is a Certificate of Digital Publication
            and does not constitute an academic degree, formal credit, or university-backed accreditation.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3 pt-4 border-t border-slate-200">
        <input
          type="checkbox"
          id="legal-agreement"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
          data-testid="legal-agreement-checkbox"
          required
        />
        <label htmlFor="legal-agreement" className="text-sm font-medium text-slate-900 cursor-pointer">
          I have read and agree to the Terms and Conditions.
        </label>
      </div>
    </div>
  );
};

export default LegalAgreement;