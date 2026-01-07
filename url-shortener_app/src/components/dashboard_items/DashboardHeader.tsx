'use client';

import React from 'react';
import { LogOut, Link2 } from 'lucide-react';

interface DashboardHeaderProps {
  userEmail?: string;
  onLogout: () => void;
}

export default function DashboardHeader({ userEmail, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Link2 size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">URLShort</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{userEmail}</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
