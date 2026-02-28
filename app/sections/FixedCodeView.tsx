'use client'

import { useState } from 'react'
import { FiCopy, FiCheck, FiChevronDown, FiChevronUp, FiArrowRight, FiTool } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

interface FixChangelog {
  change_type: string
  title: string
  description: string
  before_snippet: string
  after_snippet: string
}

interface FixedCodeViewProps {
  fixedCode: string
  fixChangelog: FixChangelog[]
  originalScore: number
  fixedScore: number
}

function changeTypeColor(type: string) {
  const t = (type ?? '').toLowerCase()
  if (t === 'security') return 'bg-red-500/15 text-red-400 border-red-500/30'
  if (t === 'performance') return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  if (t === 'style') return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
  return 'bg-gray-500/15 text-gray-400 border-gray-500/30'
}

function changeTypeIcon(type: string) {
  const t = (type ?? '').toLowerCase()
  if (t === 'security') return 'text-red-400'
  if (t === 'performance') return 'text-amber-400'
  return 'text-blue-400'
}

export default function FixedCodeView({
  fixedCode,
  fixChangelog,
  originalScore,
  fixedScore,
}: FixedCodeViewProps) {
  const [copied, setCopied] = useState(false)
  const [showChangelog, setShowChangelog] = useState(true)

  const handleCopy = async () => {
    if (!fixedCode) return
    try {
      await navigator.clipboard.writeText(fixedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for clipboard API not available
      const textarea = document.createElement('textarea')
      textarea.value = fixedCode
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const safeOriginal = typeof originalScore === 'number' ? originalScore : 0
  const safeFixed = typeof fixedScore === 'number' ? fixedScore : 0
  const improvement = safeFixed - safeOriginal

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Score Improvement Banner */}
      <Card className="border border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <FiTool className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-300">Auto-Fix Applied</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  All security vulnerabilities and performance issues have been resolved
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">Original</p>
                <p className={cn('text-lg font-bold', safeOriginal >= 70 ? 'text-emerald-400' : safeOriginal >= 40 ? 'text-amber-400' : 'text-red-400')}>
                  {safeOriginal}
                </p>
              </div>
              <FiArrowRight className="w-4 h-4 text-gray-600" />
              <div className="text-center">
                <p className="text-xs text-gray-500">Fixed</p>
                <p className={cn('text-lg font-bold', safeFixed >= 70 ? 'text-emerald-400' : safeFixed >= 40 ? 'text-amber-400' : 'text-red-400')}>
                  {safeFixed}
                </p>
              </div>
              {improvement > 0 && (
                <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10 ml-1">
                  +{improvement} pts
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Code Block */}
      <Card className="border border-gray-800 bg-gray-900/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-emerald-400" />
              Fixed Code
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className={cn(
                'border-gray-700 text-xs',
                copied
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-400'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              {copied ? (
                <>
                  <FiCheck className="w-3.5 h-3.5 mr-1.5" />
                  Copied
                </>
              ) : (
                <>
                  <FiCopy className="w-3.5 h-3.5 mr-1.5" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="max-h-[450px]">
            <pre className="text-sm text-gray-200 bg-gray-950/80 border border-gray-800 rounded-lg p-4 overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed">
              {fixedCode || 'No fixed code available'}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Fix Changelog */}
      {Array.isArray(fixChangelog) && fixChangelog.length > 0 && (
        <Card className="border border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <FiTool className="w-4 h-4 text-amber-400" />
                Fix Changelog ({fixChangelog.length} changes)
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChangelog(!showChangelog)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                {showChangelog ? (
                  <FiChevronUp className="w-4 h-4" />
                ) : (
                  <FiChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {showChangelog && (
            <CardContent className="pt-0 space-y-3">
              {fixChangelog.map((change, idx) => (
                <ChangelogEntry key={idx} change={change} index={idx} />
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}

function ChangelogEntry({ change, index }: { change: FixChangelog; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border border-gray-800 bg-gray-950/30 overflow-hidden">
        <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/30 transition-colors text-left">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-xs font-mono text-gray-600 shrink-0 w-5">{index + 1}</span>
            <Badge variant="outline" className={cn('text-xs shrink-0', changeTypeColor(change?.change_type ?? ''))}>
              {change?.change_type ?? 'fix'}
            </Badge>
            <span className="text-sm text-gray-200 truncate">{change?.title ?? 'Change'}</span>
          </div>
          {open ? (
            <FiChevronUp className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
          ) : (
            <FiChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3 border-t border-gray-800/50">
            <p className="text-sm text-gray-300 pt-3">{change?.description ?? ''}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Before */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <span className="text-xs font-medium text-red-400">Before</span>
                </div>
                <pre className="text-xs text-red-300/80 bg-red-500/5 border border-red-500/15 rounded-md p-3 overflow-x-auto font-mono whitespace-pre-wrap">
                  {change?.before_snippet ?? ''}
                </pre>
              </div>
              {/* After */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                  <span className="text-xs font-medium text-emerald-400">After</span>
                </div>
                <pre className="text-xs text-emerald-300/80 bg-emerald-500/5 border border-emerald-500/15 rounded-md p-3 overflow-x-auto font-mono whitespace-pre-wrap">
                  {change?.after_snippet ?? ''}
                </pre>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
