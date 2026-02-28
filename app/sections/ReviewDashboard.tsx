'use client'

import { useState } from 'react'
import { FiShield, FiZap, FiCode, FiChevronDown, FiChevronUp, FiAlertTriangle, FiCheckCircle, FiAlertCircle, FiArrowRight, FiTrendingUp } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

interface SecurityIssue {
  title: string
  severity: string
  description: string
  line_reference: string
  fix_suggestion: string
}

interface PerformanceIssue {
  title: string
  impact: string
  description: string
  line_reference: string
  fix_suggestion: string
}

interface StyleIssue {
  title: string
  category: string
  description: string
  line_reference: string
  fix_suggestion: string
}

interface IssueCounts {
  security_total: number
  security_critical: number
  security_high: number
  security_medium: number
  security_low: number
  performance_total: number
  performance_high: number
  performance_medium: number
  performance_low: number
  style_total: number
}

interface TopPriority {
  rank: number
  title: string
  category: string
  reason: string
}

interface ReviewDashboardProps {
  overallScore: number
  fixedScore: number
  summary: string
  languageDetected: string
  securityIssues: SecurityIssue[]
  performanceIssues: PerformanceIssue[]
  styleIssues: StyleIssue[]
  issueCounts: IssueCounts
  topPriorities: TopPriority[]
}

function severityColor(severity: string) {
  const s = (severity ?? '').toLowerCase()
  if (s === 'critical') return 'bg-red-500/15 text-red-400 border-red-500/30'
  if (s === 'high') return 'bg-orange-500/15 text-orange-400 border-orange-500/30'
  if (s === 'medium') return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  if (s === 'low') return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
  return 'bg-gray-500/15 text-gray-400 border-gray-500/30'
}

function categoryColor(cat: string) {
  const c = (cat ?? '').toLowerCase()
  if (c === 'security') return 'bg-red-500/15 text-red-400 border-red-500/30'
  if (c === 'performance') return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  if (c === 'style') return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
  if (c === 'naming') return 'bg-purple-500/15 text-purple-400 border-purple-500/30'
  if (c === 'formatting') return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
  if (c === 'error-handling') return 'bg-orange-500/15 text-orange-400 border-orange-500/30'
  if (c === 'types') return 'bg-teal-500/15 text-teal-400 border-teal-500/30'
  if (c === 'imports') return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
  return 'bg-gray-500/15 text-gray-400 border-gray-500/30'
}

function scoreColor(score: number) {
  if (score >= 70) return 'text-emerald-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-red-400'
}

function scoreBorderColor(score: number) {
  if (score >= 70) return 'border-emerald-500/40'
  if (score >= 40) return 'border-amber-500/40'
  return 'border-red-500/40'
}

function scoreBgColor(score: number) {
  if (score >= 70) return 'bg-emerald-500/10'
  if (score >= 40) return 'bg-amber-500/10'
  return 'bg-red-500/10'
}

function scoreLabel(score: number) {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 40) return 'Needs Work'
  return 'Critical'
}

function IssueCard({ title, badge, badgeClass, description, lineRef, fixSuggestion }: {
  title: string
  badge: string
  badgeClass: string
  description: string
  lineRef: string
  fixSuggestion: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border border-gray-800 bg-gray-900/40 overflow-hidden">
        <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors text-left">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Badge variant="outline" className={cn('text-xs shrink-0', badgeClass)}>
              {badge}
            </Badge>
            <span className="text-sm text-gray-200 truncate">{title ?? 'Untitled Issue'}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {lineRef && (
              <span className="text-xs text-gray-500 font-mono">{lineRef}</span>
            )}
            {open ? (
              <FiChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <FiChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3 border-t border-gray-800/60">
            <p className="text-sm text-gray-300 pt-3">{description ?? ''}</p>
            {fixSuggestion && (
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <FiCheckCircle className="w-3 h-3" />
                  Suggested Fix
                </span>
                <pre className="text-xs text-gray-300 bg-gray-950/80 border border-gray-800 rounded-md p-3 overflow-x-auto font-mono whitespace-pre-wrap">{fixSuggestion}</pre>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export default function ReviewDashboard({
  overallScore,
  fixedScore,
  summary,
  languageDetected,
  securityIssues,
  performanceIssues,
  styleIssues,
  issueCounts,
  topPriorities,
}: ReviewDashboardProps) {
  const safeScore = typeof overallScore === 'number' ? overallScore : 0
  const safeFixedScore = typeof fixedScore === 'number' ? fixedScore : 0
  const improvement = safeFixedScore - safeScore
  const totalIssues = (issueCounts?.security_total ?? 0) + (issueCounts?.performance_total ?? 0) + (issueCounts?.style_total ?? 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Original Score */}
        <Card className={cn('border bg-gray-900/50', scoreBorderColor(safeScore))}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={cn('w-16 h-16 rounded-full flex items-center justify-center border-[3px]', scoreBorderColor(safeScore), scoreBgColor(safeScore))}>
              <span className={cn('text-xl font-bold', scoreColor(safeScore))}>{safeScore}</span>
            </div>
            <div className="space-y-0.5">
              <p className={cn('text-base font-semibold', scoreColor(safeScore))}>{scoreLabel(safeScore)}</p>
              <p className="text-xs text-gray-400">Original Score</p>
            </div>
          </CardContent>
        </Card>

        {/* Fixed Score */}
        <Card className={cn('border bg-gray-900/50', scoreBorderColor(safeFixedScore))}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={cn('w-16 h-16 rounded-full flex items-center justify-center border-[3px]', scoreBorderColor(safeFixedScore), scoreBgColor(safeFixedScore))}>
              <span className={cn('text-xl font-bold', scoreColor(safeFixedScore))}>{safeFixedScore}</span>
            </div>
            <div className="space-y-0.5">
              <p className={cn('text-base font-semibold', scoreColor(safeFixedScore))}>{scoreLabel(safeFixedScore)}</p>
              <p className="text-xs text-gray-400">After Auto-Fix</p>
              {improvement > 0 && (
                <div className="flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">+{improvement} pts</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-800 bg-gray-900/50">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiAlertTriangle className="w-4 h-4" />
              <span>Issues Found</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalIssues}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs border-red-500/30 text-red-400">{issueCounts?.security_total ?? 0} Security</Badge>
              <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">{issueCounts?.performance_total ?? 0} Perf</Badge>
              <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">{issueCounts?.style_total ?? 0} Style</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-800 bg-gray-900/50">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiCode className="w-4 h-4" />
              <span>Language</span>
            </div>
            <p className="text-lg font-semibold text-white">{languageDetected || 'Unknown'}</p>
            <p className="text-xs text-gray-400 line-clamp-2">{summary || 'No summary available'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Severity Breakdown */}
      {(issueCounts?.security_total ?? 0) > 0 && (
        <div className="flex items-center gap-3 flex-wrap px-1">
          <span className="text-xs text-gray-500 font-medium">Security Breakdown:</span>
          {(issueCounts?.security_critical ?? 0) > 0 && (
            <Badge variant="outline" className="text-xs bg-red-500/15 text-red-400 border-red-500/30">{issueCounts.security_critical} Critical</Badge>
          )}
          {(issueCounts?.security_high ?? 0) > 0 && (
            <Badge variant="outline" className="text-xs bg-orange-500/15 text-orange-400 border-orange-500/30">{issueCounts.security_high} High</Badge>
          )}
          {(issueCounts?.security_medium ?? 0) > 0 && (
            <Badge variant="outline" className="text-xs bg-amber-500/15 text-amber-400 border-amber-500/30">{issueCounts.security_medium} Medium</Badge>
          )}
          {(issueCounts?.security_low ?? 0) > 0 && (
            <Badge variant="outline" className="text-xs bg-blue-500/15 text-blue-400 border-blue-500/30">{issueCounts.security_low} Low</Badge>
          )}
        </div>
      )}

      {/* Top Priorities */}
      {Array.isArray(topPriorities) && topPriorities.length > 0 && (
        <Card className="border border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 text-amber-400" />
              Top Priorities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {topPriorities.map((p, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-800/60 bg-gray-950/30">
                <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-amber-400">{p?.rank ?? idx + 1}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-medium text-gray-200">{p?.title ?? 'Priority'}</span>
                    <Badge variant="outline" className={cn('text-xs', categoryColor(p?.category ?? ''))}>{p?.category ?? 'general'}</Badge>
                  </div>
                  <p className="text-xs text-gray-400">{p?.reason ?? ''}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Issue Tabs */}
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="bg-gray-900 border border-gray-800 w-full grid grid-cols-3">
          <TabsTrigger value="security" className="text-sm data-[state=active]:bg-red-500/15 data-[state=active]:text-red-400">
            <FiShield className="w-3.5 h-3.5 mr-1.5" />
            Security ({issueCounts?.security_total ?? 0})
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-sm data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400">
            <FiZap className="w-3.5 h-3.5 mr-1.5" />
            Performance ({issueCounts?.performance_total ?? 0})
          </TabsTrigger>
          <TabsTrigger value="style" className="text-sm data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400">
            <FiCode className="w-3.5 h-3.5 mr-1.5" />
            Style ({issueCounts?.style_total ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="mt-4">
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-3">
              {Array.isArray(securityIssues) && securityIssues.length > 0 ? (
                securityIssues.map((issue, idx) => (
                  <IssueCard
                    key={idx}
                    title={issue?.title ?? ''}
                    badge={issue?.severity ?? 'Unknown'}
                    badgeClass={severityColor(issue?.severity ?? '')}
                    description={issue?.description ?? ''}
                    lineRef={issue?.line_reference ?? ''}
                    fixSuggestion={issue?.fix_suggestion ?? ''}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <FiCheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500/50" />
                  <p className="text-sm">No security issues found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-3">
              {Array.isArray(performanceIssues) && performanceIssues.length > 0 ? (
                performanceIssues.map((issue, idx) => (
                  <IssueCard
                    key={idx}
                    title={issue?.title ?? ''}
                    badge={issue?.impact ?? 'Unknown'}
                    badgeClass={severityColor(issue?.impact ?? '')}
                    description={issue?.description ?? ''}
                    lineRef={issue?.line_reference ?? ''}
                    fixSuggestion={issue?.fix_suggestion ?? ''}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <FiCheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500/50" />
                  <p className="text-sm">No performance issues found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="style" className="mt-4">
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-3">
              {Array.isArray(styleIssues) && styleIssues.length > 0 ? (
                styleIssues.map((issue, idx) => (
                  <IssueCard
                    key={idx}
                    title={issue?.title ?? ''}
                    badge={issue?.category ?? 'Style'}
                    badgeClass={categoryColor(issue?.category ?? '')}
                    description={issue?.description ?? ''}
                    lineRef={issue?.line_reference ?? ''}
                    fixSuggestion={issue?.fix_suggestion ?? ''}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <FiCheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500/50" />
                  <p className="text-sm">No style issues found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
