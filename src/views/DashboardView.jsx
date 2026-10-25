import React from 'react';
import { useApp } from '../context/AppContext';
import Badge from '../components/Badge';
import { Plus, ArrowRight, AlertTriangle, Clock, CheckCircle2, FileCheck } from 'lucide-react';

export default function DashboardView() {
  const {
    metrics,
    cases,
    resolvedCaseB,
    setActiveView,
    setSelectedCaseKey,
    setQueueSelectedCase,
  } = useApp();

  const caseB = cases.B;
  const isCaseBResolved = resolvedCaseB || caseB?.status === 'PASS';

  // Dynamic status distribution calculations
  const total = metrics.totalRecords || 3;
  const passCount = metrics.statusDistribution.PASS || 0;
  const reviewCount = metrics.statusDistribution['REVIEW REQUIRED'] || 0;
  const incompleteCount = metrics.statusDistribution.INCOMPLETE || 0;

  const passPct = Math.round((passCount / total) * 100);
  const reviewPct = Math.round((reviewCount / total) * 100);
  const incompletePct = Math.round((incompleteCount / total) * 100);

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Screen Title */}
      <div>
        <div className="text-xs text-gray-500 mb-1">
          Home &gt; <span className="text-gray-900 font-medium">Overview Dashboard</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#1e3a5f]">FDR Management Overview</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Monitor deposits, verification progress, maturity dates, and pending actions from one place.
            </p>
          </div>
          <button
            onClick={() => setActiveView('register')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#1e3a5f] hover:bg-[#2c4d75] rounded-sm transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New FDR</span>
          </button>
        </div>
      </div>

      {/* Dynamic Metric Tiles - Consistent 16px gaps (gap-4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Total FDR Records
          </div>
          <div className="text-2xl font-bold text-[#1e3a5f] mt-1.5">
            {metrics.totalRecords}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Across {metrics.totalRecords} institutions
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Pending Verification
          </div>
          <div className="text-2xl font-bold text-[#1e3a5f] mt-1.5">
            {metrics.pendingVerificationCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {metrics.pendingVerificationCount === 0 ? 'All cases verified' : 'Awaiting reviewer action'}
          </div>
        </div>

        {/* Metric 3 - Discrepancies Dynamic Tile */}
        <div 
          id="m-disc-tile"
          className={`bg-white border rounded-sm p-6 shadow-sm transition-all ${
            metrics.discrepanciesCount > 0 ? 'border-red-300 bg-red-50/15' : 'border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Discrepancies
            </span>
            {metrics.discrepanciesCount > 0 ? (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div 
            id="m-disc"
            className={`text-2xl font-bold mt-1.5 ${
              metrics.discrepanciesCount > 0 ? 'text-red-700' : 'text-emerald-700'
            }`}
          >
            {metrics.discrepanciesCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {metrics.discrepanciesCount > 0 ? 'Amount mismatch flagged' : 'No active discrepancies detected'}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Approaching Maturity
          </div>
          <div className="text-2xl font-bold text-[#1e3a5f] mt-1.5">
            {metrics.approachingMaturityCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Within 60-day renewal window
          </div>
        </div>
      </div>

      {/* Row 2: Upcoming Maturities & Pending Actions (3fr 2fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Upcoming Maturities Table (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-gray-300 rounded-sm shadow-sm flex flex-col">
          <div className="p-6 pb-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">
              Upcoming Maturities
            </h2>
            <button
              onClick={() => setActiveView('registry')}
              className="text-xs text-[#1e3a5f] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th scope="col">FDR ID</th>
                  <th scope="col">Institution</th>
                  <th scope="col" className="whitespace-nowrap">Amount</th>
                  <th scope="col" className="whitespace-nowrap">Maturity</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium text-gray-900">AICTE/FDR/2023/1122</td>
                  <td className="text-gray-700">Government Engineering College, Thrissur</td>
                  <td className="whitespace-nowrap font-semibold text-gray-900">₹40,00,000</td>
                  <td className="whitespace-nowrap text-amber-700 font-medium">10 Dec 2026</td>
                  <td>
                    <Badge status="INCOMPLETE" />
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-gray-900">AICTE/FDR/2024/0456</td>
                  <td className="text-gray-700">National Institute of Engineering, Bengaluru</td>
                  <td className="whitespace-nowrap font-semibold text-gray-900">₹25,00,000</td>
                  <td className="whitespace-nowrap text-gray-600">15 Apr 2027</td>
                  <td>
                    <Badge status="PASS" />
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-gray-900">AICTE/FDR/2024/0789</td>
                  <td className="text-gray-700">Sri Venkateswara College of Engineering, Tirupati</td>
                  <td className="whitespace-nowrap font-semibold text-gray-900">
                    {isCaseBResolved ? '₹12,00,000' : '₹10,00,000'}
                  </td>
                  <td className="whitespace-nowrap text-gray-600">20 Jun 2027</td>
                  <td>
                    <Badge status={isCaseBResolved ? 'PASS' : 'REVIEW REQUIRED'} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Actions Panel (2 cols) - 24px padding */}
        <div className="lg:col-span-2 bg-white border border-gray-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide pb-3 border-b border-gray-200">
              Pending Actions
            </h2>
            <ul className="divide-y divide-gray-100 mt-2">
              {/* Item 1: Case B action */}
              <li className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-gray-900">
                      AICTE/FDR/2024/0789 — {isCaseBResolved ? 'Resolved Finding' : 'Amount mismatch'}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Owner: S. Iyer, Assistant Director
                      <br />
                      Next action:{' '}
                      <span className={isCaseBResolved ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                        {isCaseBResolved ? 'Verification Passed (Finding Resolved)' : 'Resolve validation finding · 2 days pending'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCaseKey('B');
                      setActiveView('docintel');
                    }}
                    className="text-xs text-[#1e3a5f] hover:underline font-semibold whitespace-nowrap mt-1"
                  >
                    {isCaseBResolved ? 'View Record' : 'Inspect'}
                  </button>
                </div>
              </li>

              {/* Item 2: Case C action */}
              <li className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-gray-900">
                      AICTE/FDR/2023/1122 — Missing affidavit
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      Owner: <span className="text-amber-800 font-medium">Unassigned</span>
                      <br />
                      Next action: Assign reviewer · 3 days pending
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCaseKey('C');
                      setActiveView('docintel');
                    }}
                    className="text-xs text-[#1e3a5f] hover:underline font-semibold whitespace-nowrap mt-1"
                  >
                    Inspect
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => setActiveView('queue')}
              className="text-xs text-[#1e3a5f] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Go to Reviewer Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Case Status Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Case Status Distribution - 24px padding */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide mb-4">
            Case Status Distribution
          </h2>
          <div className="space-y-4">
            {/* PASS */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>PASS</span>
                <span>{passCount} cases ({passPct}%)</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-sm overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-500"
                  style={{ width: `${passPct}%` }}
                ></div>
              </div>
            </div>

            {/* REVIEW REQUIRED */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>REVIEW REQUIRED</span>
                <span>{reviewCount} cases ({reviewPct}%)</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-sm overflow-hidden">
                <div
                  className="bg-red-600 h-full transition-all duration-500"
                  style={{ width: `${reviewPct}%` }}
                ></div>
              </div>
            </div>

            {/* INCOMPLETE */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>INCOMPLETE</span>
                <span>{incompleteCount} cases ({incompletePct}%)</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-sm overflow-hidden">
                <div
                  className="bg-amber-600 h-full transition-all duration-500"
                  style={{ width: `${incompletePct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline - 24px padding */}
        <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide mb-4">
            Recent Activity Log
          </h2>
          <ul className="space-y-3 text-xs">
            {isCaseBResolved && (
              <li className="flex items-start gap-2.5 bg-emerald-50/60 p-2 border border-emerald-200 rounded-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0"></span>
                <div>
                  <span className="text-gray-500 font-medium">25 Oct, 10:45 — </span>
                  <span className="font-semibold text-emerald-900">
                    Validation finding resolved for AICTE/FDR/2024/0789
                  </span>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    Reviewer verified amount at ₹12,00,000 per supporting document
                  </div>
                </div>
              </li>
            )}
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#1e3a5f] mt-1 shrink-0"></span>
              <div>
                <span className="text-gray-500">25 Oct, 10:04 — </span>
                <span className="text-gray-900 font-medium">Validation finding created for AICTE/FDR/2024/0789</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-gray-400 mt-1 shrink-0"></span>
              <div>
                <span className="text-gray-500">25 Oct, 10:03 — </span>
                <span className="text-gray-900">OCR extraction completed for AICTE/FDR/2024/0789 (5 fields)</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0"></span>
              <div>
                <span className="text-gray-500">24 Oct, 16:41 — </span>
                <span className="text-gray-900">Reminder generated for AICTE/FDR/2023/1122 (maturity in 46 days)</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-gray-400 mt-1 shrink-0"></span>
              <div>
                <span className="text-gray-500">24 Oct, 11:20 — </span>
                <span className="text-gray-900">Case assigned to S. Iyer, Assistant Director</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
