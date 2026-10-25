import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  placeholder = 'Provide justification or administrative note for audit record...',
  requireReason = true,
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) {
      setError('A mandatory reason must be provided for the permanent audit trail.');
      return;
    }
    onSubmit(reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1px]">
      <div 
        role="dialog" 
        aria-modal="true" 
        className="w-full max-w-lg bg-white border border-gray-300 rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-200">
          <div className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">
            {title}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-xs text-gray-700 leading-relaxed mb-4">
            {description}
          </p>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-800 mb-1.5">
              Reason / Resolution Justification <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder={placeholder}
              className={`w-full text-xs p-2.5 border rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] ${
                error ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 border border-gray-200 rounded-sm mb-5">
            <strong>Audit Notice:</strong> This action will be permanently recorded in the immutable audit log along with your user ID, active role, and timestamp.
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#1e3a5f] rounded-sm hover:bg-[#2c4d75] transition-colors shadow-sm"
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
