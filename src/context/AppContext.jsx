import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CASES, INITIAL_AUDIT, INITIAL_ROLES, INITIAL_NOTIFICATIONS } from '../mockData';

const STORAGE_KEY = 'smartfdr_enterprise_v1';

const AppContext = createContext();

function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '1.2 MB';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function AppProvider({ children }) {
  // Clear any existing localStorage demo cache on start
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}

  // Initialize strictly from mockData.js for a fresh demo slate
  const [state, setState] = useState({
    cases: INITIAL_CASES,
    auditLogs: INITIAL_AUDIT,
    currentRoleId: 'reviewer',
    resolvedCaseB: false,
    resolveReason: '',
    notifications: INITIAL_NOTIFICATIONS,
    activeView: 'dashboard',
    selectedCaseKey: 'B',
    queueSelectedCase: null,
    reportsTab: 'overview',
    uploadedFileInfo: {
      name: 'FDR_scan_SVCE_2024.pdf',
      size: '1.2 MB',
      type: 'pdf',
      uploadedAt: '24 Oct 2026, 10:03',
      hasOcrRun: true,
      ocrResult: {
        fdrRef: 'CNR/FD/2024/221045',
        bank: 'Canara Bank',
        amount: '₹12,00,000',
        amountRaw: 1200000,
        issueDate: '20 Jun 2024',
        maturityDate: '20 Jun 2027',
        confidence: '96%',
        hasMismatch: true,
      },
    },
  });

  // Session-only document object URL
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const [flashMessage, setFlashMessage] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');

  // Flash message auto-dismiss
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  const currentRole = INITIAL_ROLES[state.currentRoleId] || INITIAL_ROLES.reviewer;

  // Actions
  const setRole = (roleId) => {
    if (INITIAL_ROLES[roleId]) {
      setState((prev) => ({ ...prev, currentRoleId: roleId }));
      showFlash(`Switched active role to ${INITIAL_ROLES[roleId].roleLabel} (${INITIAL_ROLES[roleId].name})`);
    }
  };

  const setActiveView = (view) => {
    setState((prev) => ({
      ...prev,
      activeView: view,
      queueSelectedCase: view === 'queue' ? prev.queueSelectedCase : null,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setSelectedCaseKey = (key) => {
    setState((prev) => ({ ...prev, selectedCaseKey: key }));
  };

  const setQueueSelectedCase = (caseKey) => {
    setState((prev) => ({
      ...prev,
      queueSelectedCase: caseKey,
      activeView: 'queue',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setReportsTab = (tab) => {
    setState((prev) => ({ ...prev, reportsTab: tab }));
  };

  const showFlash = (msg) => {
    setFlashMessage(msg);
  };

  const markAllAsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
    }));
    showFlash('All notifications marked as read');
  };

  const markAllNotificationsRead = markAllAsRead;

  const addNotification = (title, message, type = 'info', targetRole = 'all') => {
    const newNotif = {
      id: Date.now(),
      time: 'Just now',
      title,
      desc: message,
      type,
      targetRole,
      unread: true,
    };

    setState((prev) => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications],
    }));
  };

  // Format Indian Currency
  const formatINR = (val) => {
    if (val === undefined || val === null) return '₹0';
    const num = typeof val === 'number' ? val : parseInt(String(val).replace(/[^0-9]/g, ''), 10) || 0;
    const str = String(num);
    if (str.length <= 3) return '₹' + str;
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  };

  // Handle Real File Upload
  const handleRealFileUpload = (file) => {
    if (!file) return;

    // Revoke previous object URL if any to free memory
    if (uploadedDoc?.url) {
      URL.revokeObjectURL(uploadedDoc.url);
    }

    const objectUrl = URL.createObjectURL(file);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const docType = isPdf ? 'pdf' : 'image';
    const sizeStr = formatFileSize(file.size);
    const nowTime = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    // Update in-memory session object
    setUploadedDoc({
      file,
      url: objectUrl,
      name: file.name,
      size: sizeStr,
      type: docType,
    });

    // Update persistent state in localStorage
    setState((prev) => {
      const updatedCaseB = {
        ...prev.cases.B,
        file: file.name,
        size: sizeStr,
        uploaded: nowTime,
      };

      return {
        ...prev,
        uploadedFileInfo: {
          name: file.name,
          size: sizeStr,
          type: docType,
          uploadedAt: nowTime,
          hasOcrRun: false,
          ocrResult: null,
        },
        cases: {
          ...prev.cases,
          B: updatedCaseB,
        },
      };
    });

    showFlash(`File attached: ${file.name} (${sizeStr})`);
  };

  // Complete Fake OCR Validation
  const completeOcrValidation = () => {
    const ocrData = {
      fdrRef: 'CNR/FD/2024/221045',
      bank: 'Canara Bank',
      amount: '₹12,00,000',
      amountRaw: 1200000,
      issueDate: '20 Jun 2024',
      maturityDate: '20 Jun 2027',
      confidence: '96%',
      hasMismatch: true,
    };

    setState((prev) => {
      const caseB = prev.cases.B;
      const updatedCaseB = {
        ...caseB,
        status: prev.resolvedCaseB ? 'PASS' : 'REVIEW REQUIRED',
        hasDiscrepancy: !prev.resolvedCaseB,
      };

      return {
        ...prev,
        uploadedFileInfo: {
          ...prev.uploadedFileInfo,
          hasOcrRun: true,
          ocrResult: ocrData,
        },
        cases: {
          ...prev.cases,
          B: updatedCaseB,
        },
      };
    });

    showFlash('Validation completed: Validation finding flagged (Amount mismatch)');
  };

  // Resolve finding on Case B
  const resolveFinding = (caseKey = 'B', reason) => {
    const timestamp = '25 Oct 2026, 10:45';
    const targetCase = state.cases[caseKey];
    if (!targetCase) return;

    const updatedCase = {
      ...targetCase,
      status: 'PASS',
      hasDiscrepancy: false,
      updated: timestamp,
      tl: [
        ...targetCase.tl,
        [timestamp, `Finding resolved: amount verified at ₹12,00,000 per reviewer note`, `${currentRole.name} (${currentRole.roleLabel})`]
      ]
    };

    const newAuditEntry = [
      timestamp,
      currentRole.name,
      currentRole.roleLabel,
      'Finding resolved',
      targetCase.caseId,
      reason || 'Amount discrepancy manually verified and resolved'
    ];

    setState((prev) => ({
      ...prev,
      resolvedCaseB: true,
      resolveReason: reason,
      cases: {
        ...prev.cases,
        [caseKey]: updatedCase,
      },
      auditLogs: [...prev.auditLogs, newAuditEntry],
    }));

    showFlash(`Finding resolved successfully — Case ${targetCase.caseId} status updated to PASS`);
  };

  // Register New FDR
  const registerNewFDR = (formData) => {
    const newCaseId = `SFDR/2026/0014${Object.keys(state.cases).length + 1}`;
    const newFdrId = formData.fdrRef || `AICTE/FDR/2026/${Math.floor(1000 + Math.random() * 9000)}`;
    const newKey = `CASE_${Date.now()}`;
    const timestamp = '25 Oct 2026, 14:30';
    const attachedFileName = state.uploadedFileInfo?.name || formData.fileName || 'FDR_scan_SVCE_2024.pdf';
    const attachedFileSize = state.uploadedFileInfo?.size || '1.2 MB';

    const newCase = {
      key: newKey,
      caseId: newCaseId,
      fdr: newFdrId,
      inst: formData.instName || 'Sri Venkateswara College of Engineering, Tirupati',
      amount: formatINR(formData.amount || 1000000),
      amountRaw: Number(formData.amount) || 1000000,
      maturity: formData.maturityDate || '20 Jun 2027',
      submitted: timestamp,
      updated: timestamp,
      status: 'PASS',
      reviewer: 'Unassigned',
      file: attachedFileName,
      uploaded: timestamp,
      size: attachedFileSize,
      stage: 'Document Review',
      daysPending: 0,
      hasDiscrepancy: false,
      fields: [
        ['FDR Reference', formData.fdrRef || 'CNR/FD/2024/221045', formData.fdrRef || 'CNR/FD/2024/221045', '98%'],
        ['Bank Name', formData.bankName || 'Canara Bank', formData.bankName || 'Canara Bank', '97%'],
        ['Deposit Amount', formatINR(formData.amount || 1000000), formatINR(formData.amount || 1000000), '96%'],
        ['Issue Date', formData.issueDate || '2024-06-20', formData.issueDate || '2024-06-20', '96%'],
        ['Maturity Date', formData.maturityDate || '2027-06-20', formData.maturityDate || '2027-06-20', '95%'],
      ],
      doc: [
        (formData.bankName || 'CANARA BANK').toUpperCase(),
        (formData.branch || 'Tirupati Main Branch'),
        '',
        'FIXED DEPOSIT RECEIPT',
        `Receipt No.      : ${formData.fdrRef || 'CNR/FD/2024/221045'}`,
        `Depositor        : ${formData.instName || 'Sri Venkateswara College of Engineering'}`,
        `Amount           : Rs. ${Number(formData.amount || 1000000).toLocaleString('en-IN')}/-`,
        `Date of Deposit  : ${formData.issueDate || '20 Jun 2024'}`,
        `Maturity Date    : ${formData.maturityDate || '20 Jun 2027'}`,
        '',
        'Authorised Signatory: ______________',
      ],
      tl: [
        [timestamp, 'FDR record created', `${currentRole.name} (${currentRole.roleLabel})`],
        [timestamp, 'OCR extraction completed', 'System'],
        [timestamp, 'Validation passed', 'System'],
      ],
    };

    const newAuditEntry = [
      timestamp,
      currentRole.name,
      currentRole.roleLabel,
      'FDR record created',
      newCaseId,
      `Submitted: ${newFdrId} - ${formatINR(formData.amount || 1000000)} (${attachedFileName})`,
    ];

    setState((prev) => ({
      ...prev,
      cases: {
        ...prev.cases,
        [newKey]: newCase,
      },
      auditLogs: [...prev.auditLogs, newAuditEntry],
      activeView: 'registry',
    }));

    showFlash(`FDR record created successfully — Case ${newCaseId} routed to reviewer queue`);
  };

  // Reset to initial mock data
  const resetToMockData = () => {
    if (uploadedDoc?.url) {
      URL.revokeObjectURL(uploadedDoc.url);
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    window.location.reload();
  };

  // Dynamic calculations
  const caseList = Object.values(state.cases);
  const totalRecords = caseList.length;
  const discrepanciesCount = caseList.filter((c) => c.hasDiscrepancy).length;
  const pendingVerificationCount = caseList.filter((c) => c.status !== 'PASS').length;
  const approachingMaturityCount = caseList.filter((c) => c.approachingMaturity || c.key === 'C').length;

  const statusDistribution = {
    PASS: caseList.filter((c) => c.status === 'PASS').length,
    'REVIEW REQUIRED': caseList.filter((c) => c.status === 'REVIEW REQUIRED').length,
    INCOMPLETE: caseList.filter((c) => c.status === 'INCOMPLETE').length,
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        currentRole,
        currentRoleId: state.currentRoleId,
        setRole,
        setActiveView,
        setSelectedCaseKey,
        setQueueSelectedCase,
        setReportsTab,
        resolveFinding,
        registerNewFDR,
        resetToMockData,
        showFlash,
        flashMessage,
        setFlashMessage,
        markAllAsRead,
        markAllNotificationsRead,
        addNotification,
        formatINR,
        globalSearch,
        setGlobalSearch,
        uploadedDoc,
        handleRealFileUpload,
        completeOcrValidation,
        formatFileSize,
        metrics: {
          totalRecords,
          discrepanciesCount,
          pendingVerificationCount,
          approachingMaturityCount,
          statusDistribution,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
