import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Lock,
  ArrowLeft,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  FileQuestion
} from 'lucide-react';

export default function DocIntelView() {
  const {
    cases,
    selectedCaseKey,
    setSelectedCaseKey,
    resolvedCaseB,
    resolveReason,
    resolveFinding,
    currentRole,
    setActiveView,
    setQueueSelectedCase,
    uploadedDoc,
    uploadedFileInfo,
    handleRealFileUpload,
    addNotification,
  } = useApp();

  const fileInputRef = useRef(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  const curCase = cases[selectedCaseKey] || cases.B;
  const isCaseB = selectedCaseKey === 'B';
  const isCaseBResolved = isCaseB && (resolvedCaseB || curCase.status === 'PASS');
  const canResolve = currentRole.canResolve;

  // Check if current case has an active session file preview
  // Case B or a matching uploaded case uses the session uploadedDoc if available
  const hasSessionPreview = uploadedDoc?.url && (isCaseB || curCase.file === uploadedDoc.name);
  
  // Check if case had a file uploaded in previous session (saved in localStorage)
  const isPreviousSessionFile = !hasSessionPreview && (isCaseB || curCase.file);

  const handleResolveSubmit = (reason) => {
    resolveFinding('B', reason);
    addNotification(
      'Finding Resolved',
      `Case SFDR/2026/00123 (AICTE/FDR/2024/0789) was resolved by ${currentRole.name}.`,
      'success',
      'institution'
    );
  };

  const handleDirectUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleRealFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input for direct upload/replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf"
        onChange={handleDirectUpload}
        className="hidden"
      />

      {/* Breadcrumb & Case Selector Header */}
      <div>
        <div className="text-xs text-gray-500 mb-1">
          Home &gt; <span className="text-gray-900 font-medium">Document Verification</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#1e3a5f]">
              Document Intelligence &amp; Verification
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Extracted values are compared against submitted data using deterministic rules. OCR output does not prove authenticity.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Case Select:</label>
            <select
              value={selectedCaseKey}
              onChange={(e) => setSelectedCaseKey(e.target.value)}
              className="text-xs font-medium bg-white border border-gray-300 rounded-sm py-1.5 px-3 focus:ring-1 focus:ring-[#1e3a5f]"
            >
              <option value="A">Case A — AICTE/FDR/2024/0456 (NIE Bengaluru)</option>
              <option value="B">Case B — AICTE/FDR/2024/0789 (SVCE Tirupati) {isCaseBResolved ? '✓' : '⚠️'}</option>
              <option value="C">Case C — AICTE/FDR/2023/1122 (GEC Thrissur)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Case Header Strip - 24px padding */}
      <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center text-xs">
              <span className="w-28 text-gray-500 font-medium">Case ID:</span>
              <span className="font-semibold text-gray-900">{curCase.caseId}</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="w-28 text-gray-500 font-medium">FDR Reference:</span>
              <span className="font-semibold text-[#1e3a5f]">{curCase.fdr}</span>
            </div>
            <div className="flex items-start text-xs">
              <span className="w-28 text-gray-500 font-medium shrink-0">Institution:</span>
              <span className="font-medium text-gray-800">{curCase.inst}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center text-xs">
              <span className="w-32 text-gray-500 font-medium">Submitted Amount:</span>
              <span className="font-bold text-gray-900 whitespace-nowrap">{curCase.amount}</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="w-32 text-gray-500 font-medium">Assigned Reviewer:</span>
              <span className="font-medium text-gray-800">{curCase.reviewer}</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="w-32 text-gray-500 font-medium">Date Submitted:</span>
              <span className="text-gray-700 whitespace-nowrap">{curCase.submitted}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center text-xs">
              <span className="w-32 text-gray-500 font-medium">Maturity Date:</span>
              <span className="font-semibold text-gray-900 whitespace-nowrap">{curCase.maturity}</span>
            </div>
            <div className="flex items-center text-xs">
              <span className="w-32 text-gray-500 font-medium">Verification Status:</span>
              <Badge status={isCaseBResolved ? 'PASS' : curCase.status} />
            </div>
            <div className="flex items-center text-xs">
              <span className="w-32 text-gray-500 font-medium">Last Updated:</span>
              <span className="text-gray-600 whitespace-nowrap">{curCase.updated}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
          <span className="text-[11px] text-gray-500 italic bg-gray-50 px-2 py-0.5 border border-gray-200 rounded-sm">
            Deterministic check performed · Bank API confirmation not available
          </span>
        </div>
      </div>

      {/* Row: Uploaded Document & Extracted Fields (Consistent 16px gap) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Uploaded Document Real Preview (7 cols) - 24px padding */}
        <div className="lg:col-span-7 bg-white border border-gray-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
              <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1e3a5f]" />
                <span>Uploaded Instrument Scan</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-semibold text-[#1e3a5f] hover:underline flex items-center gap-1 bg-gray-50 hover:bg-gray-100 px-2 py-0.5 border border-gray-200 rounded-sm transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Scan</span>
                </button>
                <span className="text-xs bg-gray-100 text-gray-700 font-medium px-2 py-0.5 border border-gray-300 rounded-sm">
                  {hasSessionPreview
                    ? uploadedDoc.type === 'pdf'
                      ? 'Interactive PDF'
                      : 'Image Scan'
                    : 'Instrument View'}
                </span>
              </div>
            </div>

            {/* Document Viewer Box with Real Upload / Fallback & Watermark */}
            {hasSessionPreview ? (
              <div className="relative border border-gray-300 rounded-sm overflow-hidden bg-gray-50 min-h-[460px] max-h-[560px] flex items-center justify-center">
                {uploadedDoc.type === 'pdf' ? (
                  <iframe
                    src={uploadedDoc.url}
                    title="Uploaded FDR PDF"
                    className="w-full h-[500px] border-0"
                  />
                ) : (
                  <div className="p-4 w-full h-[500px] flex items-center justify-center overflow-auto bg-gray-900/5">
                    <img
                      src={uploadedDoc.url}
                      alt="Uploaded FDR Instrument"
                      className="max-h-[470px] w-auto max-w-full object-contain rounded-sm shadow-sm"
                    />
                  </div>
                )}
                {/* SIMULATED SCAN Watermark Overlaid on top */}
                <div className="doc-watermark pointer-events-none select-none z-20">
                  SIMULATED SCAN
                </div>
              </div>
            ) : isPreviousSessionFile && isCaseB ? (
              /* Fallback requirement: If no file uploaded in current session (e.g. after refresh) */
              <div className="relative border-2 border-dashed border-gray-300 bg-gray-50/70 rounded-sm min-h-[460px] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3 border border-gray-200">
                  <FileQuestion className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-sm font-bold text-gray-800 mb-1">
                  Document preview unavailable
                </div>
                <div className="text-xs text-gray-600 max-w-md leading-relaxed mb-4">
                  File uploaded in previous session: <strong className="text-gray-900">{curCase.file || uploadedFileInfo?.name || 'FDR_scan_SVCE_2024.pdf'}</strong> ({curCase.size || uploadedFileInfo?.size || '1.2 MB'}).
                  <br />
                  Browser security does not retain binary blob memory across reloads.
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1e3a5f] hover:bg-[#2c4d75] rounded-sm transition-colors shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach Scan File Now</span>
                </button>
                {/* Watermark still overlaid */}
                <div className="doc-watermark pointer-events-none select-none opacity-40">
                  SIMULATED SCAN
                </div>
              </div>
            ) : (
              /* Case A / Case C or text fallback */
              <div className="doc-viewer rounded-sm min-h-[460px]">
                <div className="doc-watermark">SIMULATED SCAN</div>
                {curCase.doc.join('\n')}
              </div>
            )}
          </div>

          <div className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <span>
              Filename:{' '}
              <strong className="text-gray-800">
                {uploadedDoc?.name || curCase.file || uploadedFileInfo?.name || 'FDR_scan_SVCE_2024.pdf'}
              </strong>
            </span>
            <span>
              Size: {uploadedDoc?.size || curCase.size || uploadedFileInfo?.size || '1.2 MB'} ·{' '}
              Uploaded: {curCase.uploaded || uploadedFileInfo?.uploadedAt || '24 Oct 2026, 10:03'}
            </span>
          </div>
        </div>

        {/* Right: Extracted Fields Comparison Table (5 cols) - 24px padding */}
        <div className="lg:col-span-5 bg-white border border-gray-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
              <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">
                OCR Extracted Fields
              </h2>
              <span className="text-xs text-gray-500 font-medium">Confidence Avg: 96%</span>
            </div>

            <div className="overflow-x-auto">
              <table className="gov-table text-xs">
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col" className="whitespace-nowrap">Submitted</th>
                    <th scope="col" className="whitespace-nowrap">Extracted</th>
                    <th scope="col">Match</th>
                  </tr>
                </thead>
                <tbody>
                  {curCase.fields.map(([fieldName, subVal, extVal, conf], idx) => {
                    const isMismatch = subVal !== extVal && !(isCaseBResolved && fieldName === 'Deposit Amount');
                    return (
                      <tr key={idx} className={isMismatch ? 'bg-red-50/70' : ''}>
                        <td className="font-medium text-gray-900">{fieldName}</td>
                        <td className={`whitespace-nowrap ${isMismatch ? 'text-red-700 font-bold' : 'text-gray-800'}`}>
                          {subVal}
                        </td>
                        <td className={`whitespace-nowrap ${isMismatch ? 'text-red-700 font-bold' : 'text-gray-800'}`}>
                          {extVal}
                        </td>
                        <td className="whitespace-nowrap">
                          {isMismatch ? (
                            <Badge status="MISMATCH" label="MISMATCH" />
                          ) : (
                            <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                              ✓ {conf}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100 text-right">
            <span className="text-[11px] text-gray-400">
              Deterministic OCR Extraction Model v4.2
            </span>
          </div>
        </div>
      </div>

      {/* Validation Findings Panel - 24px padding */}
      <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">
            Validation Findings &amp; Deterministic Rules
          </h2>
          <Badge status={isCaseBResolved ? 'PASS' : curCase.status} />
        </div>

        {/* Case A: Pass */}
        {selectedCaseKey === 'A' && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm">
            <div className="flex items-center gap-2 font-bold text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>No configured validation issues detected</span>
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              All 5 submitted fields exactly match OCR-extracted values from SBI deposit receipt. Case is ready for final clearance.
            </p>
          </div>
        )}

        {/* Case B: Discrepancy or Resolved */}
        {selectedCaseKey === 'B' && (
          <div>
            {isCaseBResolved ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Finding resolved — Amount verified at ₹12,00,000 per reviewer note.</span>
                  </div>
                  <div className="text-xs text-emerald-700">
                    <strong>Resolution Justification:</strong> {resolveReason || 'Verified against bank stamp and official institution letter.'}
                  </div>
                  <div className="text-[11px] text-emerald-600">
                    Resolved by {currentRole.name} ({currentRole.roleLabel}) · Immutable audit record appended.
                  </div>
                </div>
                <Badge status="RESOLVED" className="self-start sm:self-auto" />
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Amount mismatch — Deposit Amount Discrepancy Flagged</span>
                  </div>
                  <div className="text-xs text-red-700 leading-relaxed">
                    OCR extracted <strong className="underline">₹12,00,000</strong> from the uploaded FDR scan, but the submitted amount is <strong className="underline">₹10,00,000</strong>.
                    The case cannot advance until a reviewer inspects the evidence and records a resolution reason.
                  </div>
                  <div className="text-[11px] text-red-600">
                    Detected 25 Oct 2026, 10:04 · Rule: <code className="bg-red-100 px-1 py-0.5 rounded-sm">amount_consistency_check</code>
                  </div>
                </div>

                {/* Resolve Finding Button with Role Switcher Tooltip Check */}
                <div className="shrink-0 flex flex-col items-start md:items-end gap-1">
                  <button
                    id="resolve-btn"
                    disabled={!canResolve}
                    onClick={() => setIsResolveModalOpen(true)}
                    title={
                      !canResolve
                        ? 'Insufficient permissions — reviewer role required'
                        : 'Resolve finding and approve amount'
                    }
                    className={`px-4 py-2 text-xs font-semibold rounded-sm transition-all shadow-sm ${
                      canResolve
                        ? 'bg-[#1e3a5f] text-white hover:bg-[#2c4d75] cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {!canResolve && <Lock className="w-3 h-3 inline mr-1" />}
                    <span>Resolve Finding</span>
                  </button>
                  {!canResolve && (
                    <span className="text-[10px] text-red-600 font-medium italic">
                      Reviewer / Admin role required to resolve
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Case C: Incomplete */}
        {selectedCaseKey === 'C' && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Missing prescribed document — Affidavit</span>
              </div>
              <div className="text-xs text-amber-700">
                The institutional affidavit is listed as a mandatory supporting document for this approval category.
              </div>
              <div className="text-[11px] text-amber-600">
                Detected 24 Oct 2026, 16:41 · Rule: <code className="bg-amber-100 px-1 py-0.5 rounded-sm">required_documents_check</code>
              </div>
            </div>
            <button
              onClick={() => setIsCorrectionModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#1e3a5f] bg-white border border-gray-300 rounded-sm hover:bg-gray-50 self-start sm:self-auto shrink-0"
            >
              Request Correction
            </button>
          </div>
        )}

        <div className="text-[11px] text-gray-500 mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>AI flags issues only. Final regulatory decision rests with the authorized AICTE officer.</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('queue')}
              className="text-[#1e3a5f] hover:underline font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Reviewer Queue</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setQueueSelectedCase(selectedCaseKey)}
              className="text-[#1e3a5f] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Full Case History</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Resolving Finding */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onSubmit={handleResolveSubmit}
        title="Resolve Validation Finding — Case B"
        description="Provide a justification reason for resolving the deposit amount mismatch. The OCR extracted value of ₹12,00,000 will be adopted as the certified FDR amount, and the status will transition to PASS."
        confirmLabel="Confirm Resolution"
        placeholder="E.g., Verified against physical FDR scan and bank confirmation letter; institution under-reported ₹10,00,000 in error."
      />

      {/* Modal for Requesting Correction */}
      <Modal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        onSubmit={() => {}}
        title="Request Document Correction — Case C"
        description="Notify Government Engineering College, Thrissur to upload the missing non-judicial stamp affidavit."
        confirmLabel="Submit Correction Request"
        placeholder="Enter deficiency notes for the institution..."
      />
    </div>
  );
}
