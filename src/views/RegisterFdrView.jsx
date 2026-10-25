import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Check,
  FileText,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function RegisterFdrView() {
  const {
    registerNewFDR,
    setActiveView,
    setSelectedCaseKey,
    formatINR,
    uploadedDoc,
    uploadedFileInfo,
    handleRealFileUpload,
    completeOcrValidation,
    addNotification,
  } = useApp();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    instName: 'Sri Venkateswara College of Engineering, Tirupati',
    instId: '1-23456789',
    instType: 'Engineering',
    contactPerson: 'K. Sharma',
    email: 'accounts@svce.ac.in',
    phone: '+91 877 228 4400',
    fdrRef: 'CNR/FD/2024/221045',
    bankName: 'Canara Bank',
    branch: 'Tirupati Main Branch',
    amount: '1000000',
    issueDate: '2024-06-20',
    maturityDate: '2027-06-20',
    approvalRef: 'AICTE/AP/2024/1123',
    notes: 'Submitted for annual compliance renewal and intake expansion.',
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Active file information: either session object or persisted info from localStorage
  const currentFileName = uploadedDoc?.name || uploadedFileInfo?.name || null;
  const currentFileSize = uploadedDoc?.size || uploadedFileInfo?.size || null;
  const hasExtractedOcr = uploadedFileInfo?.hasOcrRun && uploadedFileInfo?.ocrResult;
  const ocrData = uploadedFileInfo?.ocrResult;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    handleRealFileUpload(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Run Fake OCR Validation for 2 seconds
  const handleRunValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      completeOcrValidation();
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerNewFDR(formData);
    addNotification(
      "New FDR Submitted",
      "A new FDR for SVCE, Tirupati requires reviewer assignment.",
      "info",
      "reviewer"
    );
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Title */}
      <div>
        <div className="text-xs text-gray-500 mb-1">
          Home &gt; <span className="text-gray-900 font-medium">Register New FDR</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#1e3a5f]">Register New Fixed Deposit Receipt</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Enter the institutional security deposit details and upload scan copies of the bank FDR instrument.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Panel 1: Institution Information - 24px padding */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide pb-3 mb-4 border-b border-gray-200">
            1. Institution Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Institution Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="instName"
                value={formData.instName}
                onChange={handleInputChange}
                required
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                AICTE Permanent Institution ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="instId"
                value={formData.instId}
                onChange={handleInputChange}
                required
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Institution Category <span className="text-red-600">*</span>
              </label>
              <select
                name="instType"
                value={formData.instType}
                onChange={handleInputChange}
                className="w-full text-xs"
              >
                <option>Engineering &amp; Technology</option>
                <option>Pharmacy</option>
                <option>Management (MBA)</option>
                <option>Architecture &amp; Town Planning</option>
                <option>Applied Arts &amp; Crafts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Authorized Signatory / Contact Person <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                required
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Official Institutional Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full text-xs"
              />
            </div>
          </div>
        </div>

        {/* Panel 2: Deposit Information - 24px padding */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide pb-3 mb-4 border-b border-gray-200">
            2. Deposit &amp; Bank Instrument Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                FDR Reference / Receipt Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fdrRef"
                value={formData.fdrRef}
                onChange={handleInputChange}
                required
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Scheduled Commercial Bank Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                required
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Issuing Branch / Office
              </label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Deposit Amount (INR) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                className="w-full text-xs font-semibold"
              />
              <div className="text-[11px] text-gray-500 mt-1 bg-gray-50 p-1.5 border border-gray-200 rounded-sm">
                Indian Denomination Preview:{' '}
                <strong className="text-[#1e3a5f]">{formatINR(formData.amount)}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Instrument Issue Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                required
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Maturity Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="maturityDate"
                value={formData.maturityDate}
                onChange={handleInputChange}
                required
                className="w-full text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Related AICTE Approval / Application Reference
              </label>
              <input
                type="text"
                name="approvalRef"
                value={formData.approvalRef}
                onChange={handleInputChange}
                className="w-full text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Administrative Notes
              </label>
              <textarea
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full text-xs"
              />
            </div>
          </div>
        </div>

        {/* Panel 3: Real Drag & Drop Document Upload & OCR Engine */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide pb-3 mb-4 border-b border-gray-200">
            3. Document Verification &amp; Real Upload Zone
          </h2>

          {/* Upload Status Table */}
          <div className="overflow-x-auto mb-4">
            <table className="gov-table text-xs">
              <thead>
                <tr>
                  <th scope="col">Document Type</th>
                  <th scope="col">Upload Status</th>
                  <th scope="col">Attached Filename &amp; Size</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold text-gray-900">Fixed Deposit Receipt (FDR Copy) *</td>
                  <td>
                    {hasExtractedOcr ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Uploaded &amp; OCR Parsed
                      </span>
                    ) : currentFileName ? (
                      <span className="text-blue-700 font-semibold flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" /> File Attached (Pending Validation)
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">No file attached</span>
                    )}
                  </td>
                  <td className="text-gray-700">
                    {currentFileName ? (
                      <span className="font-medium text-gray-900">
                        {currentFileName} <span className="text-gray-500">({currentFileSize})</span>
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-[#1e3a5f] font-semibold hover:underline"
                    >
                      {currentFileName ? 'Change file' : 'Browse file'}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-900">Institutional Application Letter *</td>
                  <td><span className="text-gray-500 italic">Pending Upload</span></td>
                  <td className="text-gray-400">—</td>
                  <td><button type="button" className="text-xs text-[#1e3a5f] font-semibold hover:underline">Attach File</button></td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-900">Affidavit (Non-Judicial Stamp Paper) *</td>
                  <td><span className="text-gray-500 italic">Pending Upload</span></td>
                  <td className="text-gray-400">—</td>
                  <td><button type="button" className="text-xs text-[#1e3a5f] font-semibold hover:underline">Attach File</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Real Drag & Drop Zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all duration-150 select-none ${
              isDragging
                ? 'border-[#1e3a5f] bg-blue-50/70 scale-[0.99]'
                : currentFileName
                ? 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div
                className={`w-12 h-12 rounded-sm flex items-center justify-center transition-colors ${
                  isDragging
                    ? 'bg-[#1e3a5f] text-white'
                    : currentFileName
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white border border-gray-300 text-gray-600 shadow-sm'
                }`}
              >
                {currentFileName?.toLowerCase().endsWith('.pdf') ? (
                  <FileText className="w-6 h-6" />
                ) : currentFileName ? (
                  <ImageIcon className="w-6 h-6" />
                ) : (
                  <Upload className="w-6 h-6 text-[#1e3a5f]" />
                )}
              </div>

              {currentFileName ? (
                <div>
                  <div className="text-xs font-bold text-gray-900 flex items-center justify-center gap-1.5">
                    <span>{currentFileName}</span>
                    <span className="text-gray-500 font-normal">({currentFileSize})</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                    ✓ File attached successfully. Drag &amp; drop another file or click to replace.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-semibold text-gray-800">
                    Drag and drop your FDR instrument here, or{' '}
                    <span className="text-[#1e3a5f] underline font-bold">browse from computer</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Accepts <strong>.pdf</strong>, <strong>.png</strong>, or <strong>.jpg</strong> (Max 5 MB).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Row: "Run Validation" Button with Spinner */}
          {currentFileName && (
            <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-gray-600">
                Attached instrument ready for deterministic OCR coordinate analysis.
              </div>

              <button
                type="button"
                onClick={handleRunValidation}
                disabled={isValidating}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold rounded-sm transition-all shadow-sm ${
                  isValidating
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#1e3a5f] text-white hover:bg-[#2c4d75] cursor-pointer'
                }`}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#1e3a5f]" />
                    <span>Processing Document OCR (2s)...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Run Validation</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* OCR Simulated Output - Shown once Validation has run */}
          {hasExtractedOcr && ocrData && (
            <div className="mt-4 space-y-3 animate-in fade-in duration-200">
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-sm">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Deterministic OCR Extraction Result
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm border border-emerald-200">
                    Extraction Successful (Confidence: {ocrData.confidence})
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[11px]">FDR REF:</span>
                    <strong className="text-gray-900">{ocrData.fdrRef}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">BANK:</span>
                    <strong className="text-gray-900">{ocrData.bank}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">DEPOSIT AMOUNT:</span>
                    <strong className="text-red-700">{ocrData.amount}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">MATURITY:</span>
                    <strong className="text-gray-900">{ocrData.maturityDate}</strong>
                  </div>
                </div>
              </div>

              {/* Amount Mismatch Banner */}
              <div className="p-3.5 bg-red-50 border border-red-200 border-l-4 border-l-red-600 rounded-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Validation Finding Flagged — Amount Mismatch</span>
                </div>
                <div className="text-xs text-red-700 mt-1 leading-relaxed">
                  OCR extracted <strong>₹12,00,000</strong> from the uploaded document, but the submitted form specifies <strong>₹10,00,000</strong>.
                  This discrepancy has been recorded and will require administrative reviewer resolution before clearance.
                </div>
                <div className="mt-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCaseKey('B');
                      setActiveView('docintel');
                    }}
                    className="text-xs text-[#1e3a5f] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>View in Document Verification View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-[#1e3a5f] hover:bg-[#2c4d75] rounded-sm transition-colors shadow-sm"
          >
            Submit for Verification
          </button>
        </div>
      </form>
    </div>
  );
}
