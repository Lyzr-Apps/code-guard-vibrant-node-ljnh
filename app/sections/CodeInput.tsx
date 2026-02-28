'use client'

import { FiCode, FiTrash2, FiArrowRight } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface CodeInputProps {
  code: string
  setCode: (code: string) => void
  selectedLanguage: string
  setSelectedLanguage: (lang: string) => void
  loading: boolean
  onAnalyze: () => void
  error: string | null
}

export default function CodeInput({
  code,
  setCode,
  selectedLanguage,
  setSelectedLanguage,
  loading,
  onAnalyze,
  error,
}: CodeInputProps) {
  const charCount = code.length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/80">
          <div className="flex items-center gap-2">
            <FiCode className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-gray-200">Paste your code or PR diff</span>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[180px] h-8 text-xs bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="JavaScript/TypeScript" className="text-gray-200 focus:bg-gray-700 focus:text-white">JavaScript / TypeScript</SelectItem>
                <SelectItem value="Python" className="text-gray-200 focus:bg-gray-700 focus:text-white">Python</SelectItem>
                <SelectItem value="Java/Kotlin" className="text-gray-200 focus:bg-gray-700 focus:text-white">Java / Kotlin</SelectItem>
              </SelectContent>
            </Select>
            {code.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCode('')}
                className="h-8 px-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <FiTrash2 className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Paste your ${selectedLanguage} code here...\n// You can paste raw source code or a PR diff.\n// The AI will analyze it for security, performance, and style issues.`}
          className="min-h-[280px] resize-y rounded-none border-0 bg-transparent text-gray-100 font-mono text-sm placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 p-5"
        />

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 bg-gray-900/80">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{charCount.toLocaleString()} characters</span>
            {selectedLanguage && (
              <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">{selectedLanguage}</Badge>
            )}
          </div>
          <Button
            onClick={onAnalyze}
            disabled={loading || code.trim().length === 0}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 disabled:opacity-40"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Code
                <FiArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
