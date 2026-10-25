import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from '../components/Badge';
import { Download, Search, RotateCcw } from 'lucide-react';

export default function RegistryView() {
  const { cases, setSelectedCaseKey, setActiveView, showFlash, globalSearch, setGlobalSearch } = useApp();

  const [institutionFilter, setInstitutionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [maturityFilter, setMaturityFilter] = useState('');

  const caseList = Object.values(cases);

  // Filter records
  const filteredCases = caseList.filter((c) => {
    // Search query check
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      const match =
        c.fdr.toLowerCase().includes(q) ||
        c.inst.toLowerCase().includes(q) ||
        c.caseId.toLowerCase().includes(q) ||
        c.reviewer.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Institution filter
    if (institutionFilter && c.key !== institutionFilter) {
      return false;
    }

    // Status filter
    if (statusFilter && c.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleReset = () => {
    setGlobalSearch('');
    setInstitutionFilter('');
    setStatusFilter('');
    setMaturityFilter('');
  };

  const handleExport = () => {
    showFlash('Export initiated — generated AICTE_FDR_Registry_Export.csv (simulated)');
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Title */}
      <div>
        <div className="text-xs text-gray-500 mb-1">
          Home &gt; <span className="text-gray-900 font-medium">FDR Registry</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#1e3a5f]">Fixed Deposit Receipts Registry</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Authoritative centralized repository of all registered FDR instruments across institutions.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1e3a5f] bg-white border border-gray-300 hover:bg-gray-50 rounded-sm transition-colors shadow-sm self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Registry (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar - 24px padding */}
      <div className="bg-white border border-gray-300 rounded-sm p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Search Keyword</label>
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="FDR ID, institution, or case..."
              className="w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Institution</label>
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="w-full text-xs"
            >
              <option value="">All Institutions</option>
              <option value="A">National Institute of Engineering, Bengaluru</option>
              <option value="B">Sri Venkateswara College of Engineering, Tirupati</option>
              <option value="C">Government Engineering College, Thrissur</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Verification Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs"
            >
              <option value="">All Statuses</option>
              <option value="PASS">PASS</option>
              <option value="REVIEW REQUIRED">REVIEW REQUIRED</option>
              <option value="INCOMPLETE">INCOMPLETE</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Maturity Horizon</label>
            <select
              value={maturityFilter}
              onChange={(e) => setMaturityFilter(e.target.value)}
              className="w-full text-xs"
            >
              <option value="">Any Window</option>
              <option value="30">Next 30 days</option>
              <option value="60">Next 60 days</option>
              <option value="90">Next 90 days</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{filteredCases.length}</strong> of{' '}
            <strong className="text-gray-900">{caseList.length}</strong> registered instruments
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-[#1e3a5f] hover:underline font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Registry Table - Force whitespace-nowrap on Amount, Maturity & Dates */}
      <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th scope="col">FDR Reference</th>
                <th scope="col">Institution</th>
                <th scope="col" className="whitespace-nowrap">Deposit Amount</th>
                <th scope="col" className="whitespace-nowrap">Maturity Date</th>
                <th scope="col">Status</th>
                <th scope="col">Assigned Officer</th>
                <th scope="col" className="whitespace-nowrap">Last Updated</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No FDR records match the specified filters. Try resetting the search criteria.
                  </td>
                </tr>
              ) : (
                filteredCases.map((record) => {
                  const isReviewRequired = record.status === 'REVIEW REQUIRED';
                  return (
                    <tr
                      key={record.key}
                      className={isReviewRequired ? 'border-l-4 border-l-red-600' : ''}
                    >
                      <td className="font-semibold text-[#1e3a5f]">
                        <div>{record.fdr}</div>
                        <div className="text-[11px] text-gray-400 font-normal">{record.caseId}</div>
                      </td>
                      <td className="text-gray-800 font-medium">{record.inst}</td>
                      <td className="whitespace-nowrap font-bold text-gray-900">{record.amount}</td>
                      <td className="whitespace-nowrap text-gray-700 font-medium">{record.maturity}</td>
                      <td>
                        <Badge status={record.status} />
                      </td>
                      <td className="text-gray-600 text-xs">{record.reviewer}</td>
                      <td className="whitespace-nowrap text-gray-500 text-xs">{record.updated}</td>
                      <td className="whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedCaseKey(record.key);
                            setActiveView('docintel');
                          }}
                          className="text-xs font-semibold text-[#1e3a5f] hover:underline"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
