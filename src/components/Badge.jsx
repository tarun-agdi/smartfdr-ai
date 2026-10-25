import React from 'react';

export default function Badge({ status, label, className = '' }) {
  const text = label || status;
  
  let colorStyles = 'bg-gray-100 text-gray-700 border-gray-300';

  if (status === 'PASS' || status === 'RESOLVED') {
    colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  } else if (status === 'REVIEW REQUIRED' || status === 'MISMATCH') {
    colorStyles = 'bg-red-50 text-red-700 border-red-300';
  } else if (status === 'INCOMPLETE' || status === 'PENDING') {
    colorStyles = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (status === 'SIMULATED') {
    colorStyles = 'bg-gray-100 text-gray-600 border-gray-300';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-sm border uppercase tracking-wider whitespace-nowrap ${colorStyles} ${className}`}
    >
      {text}
    </span>
  );
}
