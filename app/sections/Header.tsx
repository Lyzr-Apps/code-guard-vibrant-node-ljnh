'use client'

import { FiShield, FiZap, FiCode } from 'react-icons/fi'

interface HeaderProps {
  totalIssues?: number
}

export default function Header({ totalIssues }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <FiShield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">CodeGuard</h1>
              <p className="text-sm text-gray-400">AI-Powered Code Review</p>
            </div>
          </div>
          {typeof totalIssues === 'number' && totalIssues > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800/60 border border-gray-700/50 text-xs text-gray-300">
              <span className="font-medium">{totalIssues}</span>
              <span>issues found</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FiShield className="w-4 h-4 text-red-400" />
            <span>Security</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FiZap className="w-4 h-4 text-amber-400" />
            <span>Performance</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FiCode className="w-4 h-4 text-blue-400" />
            <span>Style</span>
          </div>
        </div>
      </div>
    </header>
  )
}
