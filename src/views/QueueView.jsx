import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { Clock, CheckCircle2, AlertTriangle, ArrowLeft, Lock } from 'lucide-react';

export default function QueueView() {
  const {
    cases,
    queueSelectedCase,
    setQueueSelectedCase,
    currentRole,
    showFlash,
    resolvedCaseB,
  } = useApp();

  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', desc: '', label: '' });

  const canPerformAction = currentRole.canResolve;

  const handleActionClick = (actionName) => {
    if (!canPerformAction) return;

    if (actionName === 'correction') {
      setModalConfig({
        isOpen: true,
        title: 'Request Correction from Institution',
        desc: 'Provide details on the deficiency or correction needed.',
        label: 'Submit Correction Request',
      });
    } else if (actionName === 'hold') {
      setModalConfig({
        isOpen: true,
        title: 'Place Case on Administrative Hold',
        desc: 'Specify the compliance reason for holding this FDR lifecycle review.',
        label: 'Confirm Hold',
      });
    } else if (actionName === 'observation') {
      setModalConfig({
        isOpen: true,
        title: 'Record Formal Observation Note',
        desc: 'Enter internal regulatory observations for the review file.',
        label: 'Save Observation',
      });
    } else if (actionName === 'start') {
      showFlash('Review workflow initiated — Officer assigned status: In Progress (demo)');
    } else if (actionName === 'complete') {
      showFlash('Review marked as complete — Stage advanced to Clearance Pending (demo)');
    } else if (actionName === 'decision') {
      showFlash('Final administrative decision workflow recorded (demo only)');
    }
  };

  // Case detail view
  if (queueSelectedCase) {
    const cur = cases[queueSelectedCase] || cases.B;
    const isResolved = cur.key === 'B' && (resolvedCaseB || cur.status === 'PASS');

    return (
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Home &gt;{' '}
            <button
              onClick={() => setQueueSelectedCase(null)}
              className="text-gray-600 hover:underline"
            >
              Reviewer Queue
            </button>{' '}
            &gt; <span className="text-gray-900 font-medium">{cur.caseId}</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-[#1e3a5f]">
              Case Dossier — {cur.caseId}
            </h1>
            <button
              onClick={() => setQueueSelectedCase(null)}
              className="text-xs text-[#1e3a5f] hover:underline font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Queue</span>
            </button>
          </div>
        </div>

        {/* Case Info Panel - 24px padding */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5 text-xs">
              <div><span className="text-gray-500 w-28 inline-block font-medium">Case ID:</span> <strong>{cur.caseId}</strong></div>
              <div><span className="text-gray-500 w-28 inline-block font-medium">FDR ID:</span> <strong className="text-[#1e3a5f]">{cur.fdr}</strong></div>
              <div><span className="text-gray-500 w-28 inline-block font-medium">Institution:</span> {cur.inst}</div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div><span className="text-gray-500 w-32 inline-block font-medium">Deposit Amount:</span> <strong className="whitespace-nowrap">{cur.amount}</strong></div>
              <div><span className="text-gray-500 w-32 inline-block font-medium">Maturity Date:</span> <span className="whitespace-nowrap">{cur.maturity}</span></div>
              <div><span className="text-gray-500 w-32 inline-block font-medium">Date Submitted:</span> <span className="whitespace-nowrap">{cur.submitted}</span></div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div><span className="text-gray-500 w-32 inline-block font-medium">Current Status:</span> <Badge status={isResolved ? 'PASS' : cur.status} /></div>
              <div><span className="text-gray-500 w-32 inline-block font-medium">Assigned Officer:</span> {cur.reviewer}</div>
              <div><span className="text-gray-500 w-32 inline-block font-medium">Last Modified:</span> <span className="whitespace-nowrap">{cur.updated}</span></div>
            </div>
          </div>
        </div>

        {/* 2-column: Case Timeline & Reviewer Actions - 16px gap, 24px padding */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Timeline (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide pb-3 mb-4 border-b border-gray-200">
              Audit Event Timeline
            </h2>
            <div className="space-y-4">
              {cur.tl.map(([time, desc, actor], idx) => {
                const isLast = idx === cur.tl.length - 1;
                return (
                  <div key={idx} className="flex items-start gap-3 relative">
                    {!isLast && (
                      <div className="absolute left-[7px] top-4 w-[2px] h-full bg-gray-200"></div>
                    )}
                    <div
                      className={`w-4 h-4 rounded-full border-2 bg-white mt-0.5 shrink-0 z-10 ${
                        isLast ? 'border-emerald-600 bg-emerald-100' : 'border-[#1e3a5f]'
                      }`}
                    ></div>
                    <div className="text-xs">
                      <div className="font-semibold text-gray-900">{desc}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {time} · <span className="font-medium text-gray-700">{actor}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviewer Actions (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-gray-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide pb-3 mb-4 border-b border-gray-200">
                Authorized Officer Actions
              </h2>

              {!canPerformAction && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-sm mb-4">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Reviewer Access Restricted</span>
                  </div>
                  You are viewing this portal as <strong>{currentRole.roleLabel}</strong>. Administrative reviewer actions are disabled. Use the Role Switcher in the top header to switch to Reviewer or Administrator persona.
                </div>
              )}

              <div className="space-y-2">
                <button
                  disabled={!canPerformAction}
                  onClick={() => handleActionClick('start')}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-sm border text-left transition-colors ${
                    canPerformAction
                      ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-800'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  1. Start Formal Review
                </button>

                <button
                  disabled={!canPerformAction}
                  onClick={() => handleActionClick('complete')}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-sm border text-left transition-colors ${
                    canPerformAction
                      ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-800'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  2. Mark Verification Complete
                </button>

                <button
                  disabled={!canPerformAction}
                  onClick={() => handleActionClick('correction')}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-sm border text-left transition-colors ${
                    canPerformAction
                      ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-800'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  3. Request Institutional Correction
                </button>

                <button
                  disabled={!canPerformAction}
                  onClick={() => handleActionClick('hold')}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-sm border text-left transition-colors ${
                    canPerformAction
                      ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-800'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  4. Place Case on Hold
                </button>

                <button
                  disabled={!canPerformAction}
                  onClick={() => handleActionClick('observation')}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-sm border text-left transition-colors ${
                    canPerformAction
                      ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-800'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  5. Record Internal Observation
                </button>

                <button
                  disabled={!canPerformAction}
                  onClick={() => handleActionClick('decision')}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-sm border text-left transition-colors ${
                    canPerformAction
                      ? 'bg-[#1e3a5f] text-white hover:bg-[#2c4d75]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  6. Final Approval Decision
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
              AI flags issues only. Final regulatory decision rests with the authorized officer.
            </div>
          </div>
        </div>

        <Modal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          onSubmit={() => showFlash('Action recorded into audit trail')}
          title={modalConfig.title}
          description={modalConfig.desc}
          confirmLabel={modalConfig.label}
        />
      </div>
    );
  }

  // Queue List Table View
  return (
    <div className="space-y-4">
      {/* Breadcrumb & Title */}
      <div>
        <div className="text-xs text-gray-500 mb-1">
          Home &gt; <span className="text-gray-900 font-medium">Reviewer Queue</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#1e3a5f]">Reviewer Action Queue</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Cases awaiting administrative review, prioritized by elapsed pending duration and compliance deadlines.
          </p>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th scope="col">Case ID</th>
                <th scope="col">FDR Reference</th>
                <th scope="col">Institution</th>
                <th scope="col">Workflow Stage</th>
                <th scope="col">Assigned Officer</th>
                <th scope="col">Next Required Action</th>
                <th scope="col" className="whitespace-nowrap">Days Pending</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Case B (Attention case) */}
              <tr className="border-l-4 border-l-red-600 bg-red-50/10">
                <td className="font-semibold text-gray-900">SFDR/2026/00123</td>
                <td className="font-semibold text-[#1e3a5f]">AICTE/FDR/2024/0789</td>
                <td className="text-gray-700">SVCE, Tirupati</td>
                <td>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-[#1e3a5f] border border-blue-200 rounded-sm">
                    Document Review
                  </span>
                </td>
                <td className="text-gray-800">S. Iyer, Assistant Director</td>
                <td>
                  <span className={resolvedCaseB ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                    {resolvedCaseB ? 'Verified (Ready for clearance)' : 'Resolve validation finding'}
                  </span>
                </td>
                <td className="whitespace-nowrap font-bold text-red-700">2 days</td>
                <td className="whitespace-nowrap">
                  <button
                    onClick={() => setQueueSelectedCase('B')}
                    className="text-xs font-semibold text-[#1e3a5f] hover:underline"
                  >
                    Open Case →
                  </button>
                </td>
              </tr>

              {/* Row 2: Case A */}
              <tr>
                <td className="font-semibold text-gray-900">SFDR/2026/00101</td>
                <td className="font-semibold text-[#1e3a5f]">AICTE/FDR/2024/0456</td>
                <td className="text-gray-700">NIE, Bengaluru</td>
                <td>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-sm">
                    Decision Pending
                  </span>
                </td>
                <td className="text-gray-800">R. Mehta, Deputy Director</td>
                <td className="text-gray-700">Record final decision</td>
                <td className="whitespace-nowrap font-medium text-gray-600">1 day</td>
                <td className="whitespace-nowrap">
                  <button
                    onClick={() => setQueueSelectedCase('A')}
                    className="text-xs font-semibold text-[#1e3a5f] hover:underline"
                  >
                    Open Case →
                  </button>
                </td>
              </tr>

              {/* Row 3: Case C */}
              <tr className="bg-amber-50/10">
                <td className="font-semibold text-gray-900">SFDR/2026/00088</td>
                <td className="font-semibold text-[#1e3a5f]">AICTE/FDR/2023/1122</td>
                <td className="text-gray-700">GEC, Thrissur</td>
                <td>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-sm">
                    Correction Required
                  </span>
                </td>
                <td className="text-amber-800 font-medium">Unassigned</td>
                <td className="text-amber-900 font-semibold">Assign reviewer</td>
                <td className="whitespace-nowrap font-bold text-red-700">3 days</td>
                <td className="whitespace-nowrap">
                  <button
                    onClick={() => setQueueSelectedCase('C')}
                    className="text-xs font-semibold text-[#1e3a5f] hover:underline"
                  >
                    Open Case →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
