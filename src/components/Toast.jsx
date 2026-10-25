import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast() {
  const { flashMessage, setFlashMessage } = useApp();

  if (!flashMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-3 bg-[#0f2743] text-white px-4 py-3 rounded-sm shadow-xl border border-gray-700 max-w-md">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <div className="text-xs font-medium leading-snug flex-1">
          {flashMessage}
        </div>
        <button
          onClick={() => setFlashMessage(null)}
          className="text-gray-400 hover:text-white p-1 rounded-sm"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
