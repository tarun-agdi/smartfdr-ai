import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, BarChart3, ListFilter } from 'lucide-react';

export default function ReportsView() {
  const { auditLogs, reportsTab, setReportsTab } = useApp();

  const stages = [
    { label: 'Document Review', count: 1, max: 1 },
    { label: 'Decision Pending', count: 1, max: 1 },
    { label: 'Correction Required', count: 1, max: 1 },
    { label: 'Clearance Pending', count: 0, max: 1 },
    { label: 'Approved (Simulated)', count: 0, max: 1 },
  ];

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Title */}
      <div>
        <div className="text-xs text-gray-500 mb-1">
          Home &gt; <span className="text-gray-900 font-medium">Reports &amp; Audit</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#1e3a5f]">Compliance Reports &amp; Immutable Audit</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Workflow performance metrics, reviewer backlog visibility, and append-only governance trail.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 gap-1">
        <button
          onClick={() => setReportsTab('overview')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-[1px] transition-colors ${
            reportsTab === 'overview'
              ? 'border-[#1e3a5f] text-[#1e3a5f] bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Workflow Overview &amp; Bottlenecks
        </button>
        <button
          onClick={() => setReportsTab('audit')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-[1px] transition-colors flex items-center gap-1.5 ${
            reportsTab === 'audit'
              ? 'border-[#1e3a5f] text-[#1e3a5f] bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Immutable Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {reportsTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-100">
          {/* Top Metric Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Average Case Duration
              </div>
              <div className="text-2xl font-bold text-[#1e3a5f] mt-1.5">6.4 days</div>
              <div className="text-xs text-gray-500 mt-1">Across all completed reviews</div>
            </div>

            <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm border-l-4 border-l-red-600">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Cases Overdue
              </div>
              <div className="text-2xl font-bold text-red-700 mt-1.5">2</div>
              <div className="text-xs text-gray-500 mt-1">Beyond SLA target turnaround</div>
            </div>

            <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Simulated Releases (YTD)
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-1.5">0</div>
              <div className="text-xs text-gray-500 mt-1">Demo environment data only</div>
            </div>
          </div>

          {/* Cases by Stage */}
          <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide pb-3 mb-4 border-b border-gray-200">
              Cases by Processing Stage
            </h2>
            <div className="space-y-3">
              {stages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-4 text-xs">
                  <div className="w-44 text-gray-700 font-medium">{stage.label}</div>
                  <div className="flex-1 bg-gray-100 h-3 rounded-sm overflow-hidden">
                    {stage.count > 0 && (
                      <div
                        className="bg-[#1e3a5f] h-full"
                        style={{ width: `${(stage.count / stage.max) * 100}%` }}
                      ></div>
                    )}
                  </div>
                  <div className="w-8 text-right font-bold text-gray-900">{stage.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Cases Table & Pending Actions by Reviewer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
              <div className="p-6 pb-3 border-b border-gray-200">
                <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">
                  Overdue Cases Requiring Escalation
                </h2>
              </div>
              <table className="gov-table text-xs">
                <thead>
                  <tr>
                    <th scope="col">Case ID</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Next Action</th>
                    <th scope="col" className="whitespace-nowrap">Days Pending</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold text-gray-900">SFDR/2026/00123</td>
                    <td className="text-gray-700">S. Iyer, Assistant Director</td>
                    <td className="text-red-700 font-medium">Resolve validation finding</td>
                    <td className="whitespace-nowrap font-bold text-red-700">2 days</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-900">SFDR/2026/00088</td>
                    <td className="text-amber-800 font-medium">Unassigned</td>
                    <td className="text-amber-900 font-medium">Assign reviewer</td>
                    <td className="whitespace-nowrap font-bold text-red-700">3 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
              <div className="p-6 pb-3 border-b border-gray-200">
                <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide">
                  Pending Actions by Reviewer
                </h2>
              </div>
              <table className="gov-table text-xs">
                <thead>
                  <tr>
                    <th scope="col">Reviewer / Officer</th>
                    <th scope="col" className="whitespace-nowrap">Active Assigned Cases</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium text-gray-900">S. Iyer (Assistant Director)</td>
                    <td className="whitespace-nowrap font-semibold text-gray-800">1 case</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-900">R. Mehta (Deputy Director)</td>
                    <td className="whitespace-nowrap font-semibold text-gray-800">1 case</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-amber-800">Unassigned Pool</td>
                    <td className="whitespace-nowrap font-semibold text-amber-900">1 case</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Immutable Audit Log */}
      {reportsTab === 'audit' && (
        <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden animate-in fade-in duration-100">
          <div className="p-6 pb-3 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Regulatory Audit Log (Append-Only)</span>
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Audit records are tamper-resistant, append-only, and permanently preserved across system restarts.
              </p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-1 rounded-sm border border-gray-300">
              Total Records: {auditLogs.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="gov-table text-xs">
              <thead>
                <tr>
                  <th scope="col" className="whitespace-nowrap">Timestamp</th>
                  <th scope="col">User</th>
                  <th scope="col">Role</th>
                  <th scope="col">Action Taken</th>
                  <th scope="col" className="whitespace-nowrap">Case ID</th>
                  <th scope="col">Reason / Administrative Metadata</th>
                </tr>
              </thead>
              <tbody>
                {[...auditLogs].reverse().map(([time, user, role, action, caseId, reason], idx) => {
                  const isResolvedAction = action === 'Finding resolved';
                  return (
                    <tr
                      key={idx}
                      className={isResolvedAction ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600' : ''}
                    >
                      <td className="whitespace-nowrap font-medium text-gray-600">{time}</td>
                      <td className="font-semibold text-gray-900">{user}</td>
                      <td>
                        <span className="text-[11px] font-semibold uppercase px-1.5 py-0.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-sm">
                          {role}
                        </span>
                      </td>
                      <td className={`font-semibold ${isResolvedAction ? 'text-emerald-800' : 'text-gray-900'}`}>
                        {action}
                      </td>
                      <td className="whitespace-nowrap font-mono text-[#1e3a5f] font-semibold">
                        {caseId}
                      </td>
                      <td className="text-gray-700 leading-snug">{reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
