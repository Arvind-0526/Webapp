import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    private: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const labels = {
    pending: 'Pending Review',
    approved: 'Approved & Published',
    rejected: 'Rejected',
    private: 'Private (Link-only)',
  };

  return (
    <span 
      className={`inline-block px-3 py-1 text-xs font-medium border rounded-full ${styles[status]}`}
      data-testid={`status-badge-${status}`}
    >
      {labels[status] || status}
    </span>
  );
};

export default StatusBadge;