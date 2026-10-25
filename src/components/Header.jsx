import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Search, ChevronDown, Check, Shield, User, RotateCcw } from 'lucide-react';
import { INITIAL_ROLES } from '../mockData';

export default function Header() {
  const {
    activeView,
    setActiveView,
    currentRole,
    setRole,
    notifications,
    markAllAsRead,
    markAllNotificationsRead,
    globalSearch,
    setGlobalSearch,
    resetToMockData,
  } = useApp();

  const [showNotif, setShowNotif] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const notifRef = useRef(null);
  const roleRef = useRef(null);

  const roleId = currentRole.id;
  // Role-based notification filtering: show notifications where targetRole === currentRole OR targetRole === 'all'
  const roleNotifications = notifications.filter((n) => {
    if (!n.targetRole || n.targetRole === 'all') return true;
    if (roleId === 'administrator') return true;
    return n.targetRole === roleId;
  });

  const unreadCount = roleNotifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setShowRoleMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard' },
    { id: 'registry', label: 'FDR Registry' },
    { id: 'register', label: 'Register New FDR' },
    { id: 'docintel', label: 'Document Verification' },
    { id: 'queue', label: 'Reviewer Queue' },
    { id: 'reports', label: 'Reports & Audit' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activeView !== 'registry') {
      setActiveView('registry');
    }
  };

  return (
    <header className="w-full bg-white select-none">
      {/* Tier 1: Government of India Bar */}
      <div className="h-7 bg-[#0f2743] text-[#e5e7eb] text-[11px] flex justify-between items-center px-6">
        <div className="flex items-center gap-2">
          <span>भारत सरकार | Government of India</span>
          <span className="text-gray-400">|</span>
          <span>All India Council for Technical Education (AICTE)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1.5 text-gray-300">
            <span className="cursor-pointer hover:text-white px-1">A−</span>
            <span className="cursor-pointer hover:text-white px-1 font-semibold">A</span>
            <span className="cursor-pointer hover:text-white px-1">A+</span>
          </div>
          <span className="text-gray-500">|</span>
          <span className="cursor-pointer text-gray-300 hover:text-white">English ▾</span>
        </div>
      </div>

      {/* Tier 2: Main Branding, Search Bar, Notifications & Role Switcher */}
      <div className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-6 gap-6">
        {/* Emblem & Portal Title */}
        <div 
          className="flex items-center gap-3.5 cursor-pointer shrink-0" 
          onClick={() => setActiveView('dashboard')}
        >
          {/* Official Emblem Placeholder SVG */}
          <div className="w-10 h-10 border border-gray-300 rounded-sm bg-gray-50 flex items-center justify-center p-1 text-[#1e3a5f] shadow-inner">
            <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
              {/* Ashoka Chakra & Shield Hybrid Government Motif */}
              <circle cx="24" cy="24" r="20" stroke="#1e3a5f" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="24" cy="24" r="14" stroke="#1e3a5f" strokeWidth="1.5" />
              <circle cx="24" cy="24" r="4" fill="#1e3a5f" />
              {/* Spokes */}
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="24"
                  y1="24"
                  x2={24 + 14 * Math.cos((i * 30 * Math.PI) / 180)}
                  y2={24 + 14 * Math.sin((i * 30 * Math.PI) / 180)}
                  stroke="#1e3a5f"
                  strokeWidth="1.2"
                />
              ))}
              <path d="M16 4h16l-3 4H19z" fill="#f59e0b" />
              <path d="M16 44h16l-3-4H19z" fill="#15803d" />
            </svg>
          </div>
          <div>
            <div className="text-[17px] font-bold text-[#1e3a5f] leading-tight tracking-tight flex items-center gap-2">
              <span>SmartFDR AI</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-blue-50 text-blue-800 border border-blue-200 rounded-sm">
                AICTE Gov
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              Intelligent Security Deposit &amp; FDR Lifecycle Management
            </div>
          </div>
        </div>

        {/* Search Bar - Fixed alignment with flex-1 max-w-md as requested */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search by FDR reference, institution, or case ID..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] text-gray-800 placeholder-gray-400"
            />
          </div>
        </form>

        {/* Right Controls: Notifications, Role Switcher, Quick Reset Helper */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Demo Reset Button */}
          <button
            onClick={resetToMockData}
            title="Reset to initial mock state"
            className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-800 px-2 py-1 border border-gray-200 rounded-sm bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>

            {/* Notification Bell */}
          <div className="relative shrink-0" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotif(!showNotif);
                setShowRoleMenu(false);
              }}
              aria-label="Notifications"
              className="relative p-2 rounded-sm border border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50 transition-colors"
            >
              <Bell className="w-4 h-4 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#b91c1c] rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotif && (
              <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-300 rounded-sm shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Notifications</span>
                    {unreadCount > 0 ? (
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-sm">
                        {unreadCount} unread
                      </span>
                    ) : (
                      <span className="text-[10px] bg-gray-200 text-gray-600 font-medium px-1.5 py-0.5 rounded-sm">
                        All read
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => (markAllAsRead ? markAllAsRead(roleId) : markAllNotificationsRead())}
                      className="text-xs text-[#1e3a5f] hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {roleNotifications.length === 0 ? (
                    <div className="p-5 text-xs text-gray-500 text-center">
                      No notifications for {currentRole.roleLabel}.
                    </div>
                  ) : (
                    roleNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 text-xs transition-colors ${
                          notif.unread
                            ? 'border-l-4 border-l-red-600 bg-red-50/20 hover:bg-red-50/40'
                            : 'border-l-4 border-l-transparent hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-gray-500 text-[11px] mb-1">
                          <span className={notif.time === 'Just now' ? 'text-emerald-700 font-semibold' : ''}>
                            {notif.time}
                          </span>
                          {notif.type === 'success' ? (
                            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded-sm border border-emerald-200">
                              Resolved
                            </span>
                          ) : notif.type === 'info' ? (
                            <span className="text-[10px] uppercase font-bold text-blue-800 bg-blue-100 px-1 py-0.2 rounded-sm border border-blue-200">
                              Submission
                            </span>
                          ) : notif.unread ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          ) : null}
                        </div>
                        <div className="font-semibold text-gray-900 mb-0.5">{notif.title}</div>
                        <div className="text-gray-600 leading-snug">{notif.desc}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            )}
          </div>

          {/* Role Switcher Button & Dropdown */}
          <div className="relative shrink-0" ref={roleRef}>
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotif(false);
              }}
              aria-label="Switch active role"
              className="flex items-center gap-2.5 px-3 py-1.5 border border-gray-300 rounded-sm hover:border-gray-400 bg-white transition-all text-left"
            >
              <div className="w-7 h-7 rounded-sm bg-[#1e3a5f] text-white flex items-center justify-center font-bold text-xs uppercase">
                {currentRole.name.charAt(0)}
              </div>
              <div className="leading-tight">
                <div className="text-xs font-semibold text-gray-900">{currentRole.name}</div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                  <span>{currentRole.roleLabel}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </button>

            {/* Role Switcher Popover */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded-sm shadow-xl z-50 divide-y divide-gray-100">
                <div className="p-3 bg-gray-50">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Select Demonstration Persona
                  </div>
                  <div className="text-[11px] text-gray-600">
                    Switch permissions to test access control rules
                  </div>
                </div>
                <div className="p-1">
                  {Object.values(INITIAL_ROLES).map((role) => {
                    const isSelected = role.id === currentRole.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => {
                          setRole(role.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-sm flex items-start justify-between text-xs transition-colors ${
                          isSelected
                            ? 'bg-blue-50/70 text-[#1e3a5f] font-semibold'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{role.roleLabel}</span>
                            <span className="font-normal text-gray-500">({role.name})</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{role.department}</div>
                          {role.id === 'institution' && (
                            <div className="text-[10px] text-amber-700 mt-1 font-medium bg-amber-50 px-1 py-0.5 border border-amber-200 inline-block">
                              Cannot resolve findings
                            </div>
                          )}
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#1e3a5f] shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tier 3: Sharp Government Navigation Bar */}
      <nav className="h-10 bg-white border-b-2 border-[#1e3a5f] flex items-center px-6 gap-1 shadow-sm overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`h-full px-4 text-xs font-semibold transition-all whitespace-nowrap border-b-2 -mb-[2px] ${
                isActive
                  ? 'border-[#1e3a5f] text-[#1e3a5f] bg-gray-50'
                  : 'border-transparent text-gray-700 hover:text-[#1e3a5f] hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
