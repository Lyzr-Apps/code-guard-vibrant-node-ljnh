'use client'

import React, { useState, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FiRefreshCw, FiShield } from 'react-icons/fi'

import Header from './sections/Header'
import CodeInput from './sections/CodeInput'
import ReviewDashboard from './sections/ReviewDashboard'

// --- Types ---

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

interface CodeReviewResult {
  overall_score: number
  summary: string
  language_detected: string
  security_issues: SecurityIssue[]
  performance_issues: PerformanceIssue[]
  style_issues: StyleIssue[]
  issue_counts: IssueCounts
  top_priorities: TopPriority[]
}

// --- Constants ---

const AGENT_ID = '69a2854ca96eb35aa78a9ccd'

const SAMPLE_RESULT: CodeReviewResult = {
  overall_score: 52,
  summary: 'The code has several security vulnerabilities including SQL injection risks and hardcoded credentials. Performance can be improved by optimizing database queries and adding caching. Multiple style violations were detected in naming conventions and error handling.',
  language_detected: 'JavaScript/TypeScript',
  security_issues: [
    { title: 'SQL Injection Vulnerability', severity: 'Critical', description: 'User input is directly concatenated into SQL query string on line 45 without parameterization or sanitization.', line_reference: 'Line 45', fix_suggestion: 'const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);' },
    { title: 'Hardcoded API Secret', severity: 'High', description: 'API secret key is hardcoded in the source file. This exposes sensitive credentials if the code is committed to version control.', line_reference: 'Line 12', fix_suggestion: 'const API_SECRET = process.env.API_SECRET;\nif (!API_SECRET) throw new Error("API_SECRET env var required");' },
    { title: 'Missing Input Validation', severity: 'Medium', description: 'The email parameter in the registration handler is not validated for format or length before being stored.', line_reference: 'Line 78', fix_suggestion: 'import { z } from "zod";\nconst emailSchema = z.string().email().max(255);\nconst validEmail = emailSchema.parse(req.body.email);' },
  ],
  performance_issues: [
    { title: 'N+1 Database Query', severity: 'High', impact: 'High', description: 'Fetching user details inside a loop causes N+1 query problem. Each iteration triggers a separate database call.', line_reference: 'Lines 60-68', fix_suggestion: 'const userIds = orders.map(o => o.userId);\nconst users = await db.query("SELECT * FROM users WHERE id = ANY($1)", [userIds]);' },
    { title: 'Unoptimized Array Search', severity: 'Medium', impact: 'Medium', description: 'Using Array.find() inside a nested loop creates O(n*m) complexity when a Map lookup would be O(n+m).', line_reference: 'Line 92', fix_suggestion: 'const userMap = new Map(users.map(u => [u.id, u]));\nconst user = userMap.get(order.userId);' },
  ],
  style_issues: [
    { title: 'Inconsistent Naming Convention', category: 'naming', description: 'Mix of camelCase and snake_case variable names. The project should use a consistent naming convention.', line_reference: 'Lines 15, 32, 48', fix_suggestion: 'Rename user_name to userName, api_key to apiKey for consistency with JavaScript conventions.' },
    { title: 'Missing Error Handling', category: 'error-handling', description: 'The async database call has no try-catch block and no error response to the client.', line_reference: 'Line 55', fix_suggestion: 'try {\n  const result = await db.query(...);\n  res.json(result);\n} catch (err) {\n  console.error("DB error:", err);\n  res.status(500).json({ error: "Internal server error" });\n}' },
    { title: 'Unused Import', category: 'imports', description: 'The "lodash" module is imported but never used in the file. This adds unnecessary bundle size.', line_reference: 'Line 3', fix_suggestion: 'Remove the unused import: // import _ from "lodash"' },
  ],
  issue_counts: {
    security_total: 3, security_critical: 1, security_high: 1, security_medium: 1, security_low: 0,
    performance_total: 2, performance_high: 1, performance_medium: 1, performance_low: 0,
    style_total: 3,
  },
  top_priorities: [
    { rank: 1, title: 'SQL Injection Vulnerability', category: 'security', reason: 'Critical security flaw that can allow attackers to access or modify the entire database.' },
    { rank: 2, title: 'Hardcoded API Secret', category: 'security', reason: 'Exposed credentials can be exploited if the repository becomes public or is shared.' },
    { rank: 3, title: 'N+1 Database Query', category: 'performance', reason: 'Causes severe performance degradation as data grows, resulting in hundreds of unnecessary queries.' },
  ],
}

const SAMPLE_CODE = `const express = require('express');
const db = require('./db');
const _ = require('lodash');

const API_SECRET = 'sk-abc123-super-secret-key';

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const result = await db.query(
    "INSERT INTO users (email, password) VALUES ('" + email + "', '" + password + "')"
  );
  res.json({ success: true, userId: result.id });
});

app.get('/orders', async (req, res) => {
  const orders = await db.query('SELECT * FROM orders');
  const enriched = [];
  for (const order of orders) {
    const user = await db.query('SELECT * FROM users WHERE id = ' + order.user_id);
    enriched.push({ ...order, user_name: user[0].name });
  }
  res.json(enriched);
});`

// --- Error Boundary ---

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-500 transition-colors">
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// --- Page ---

export default function Page() {
  const [code, setCode] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript/TypeScript')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewResult, setReviewResult] = useState<CodeReviewResult | null>(null)
  const [showSampleData, setShowSampleData] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    setActiveAgentId(AGENT_ID)

    try {
      const message = `Review the following ${selectedLanguage} code for security vulnerabilities, performance issues, and style guide adherence:\n\n${code}`
      const result = await callAIAgent(message, AGENT_ID)

      if (result.success && result?.response?.result) {
        const data = result.response.result as CodeReviewResult
        setReviewResult({
          overall_score: typeof data?.overall_score === 'number' ? data.overall_score : 0,
          summary: data?.summary ?? 'No summary available',
          language_detected: data?.language_detected ?? selectedLanguage,
          security_issues: Array.isArray(data?.security_issues) ? data.security_issues : [],
          performance_issues: Array.isArray(data?.performance_issues) ? data.performance_issues : [],
          style_issues: Array.isArray(data?.style_issues) ? data.style_issues : [],
          issue_counts: {
            security_total: data?.issue_counts?.security_total ?? 0,
            security_critical: data?.issue_counts?.security_critical ?? 0,
            security_high: data?.issue_counts?.security_high ?? 0,
            security_medium: data?.issue_counts?.security_medium ?? 0,
            security_low: data?.issue_counts?.security_low ?? 0,
            performance_total: data?.issue_counts?.performance_total ?? 0,
            performance_high: data?.issue_counts?.performance_high ?? 0,
            performance_medium: data?.issue_counts?.performance_medium ?? 0,
            performance_low: data?.issue_counts?.performance_low ?? 0,
            style_total: data?.issue_counts?.style_total ?? 0,
          },
          top_priorities: Array.isArray(data?.top_priorities) ? data.top_priorities : [],
        })
      } else {
        setError(result?.error || 'Analysis failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }, [code, selectedLanguage])

  const handleNewReview = useCallback(() => {
    setReviewResult(null)
    setCode('')
    setError(null)
  }, [])

  const handleToggleSample = useCallback((checked: boolean) => {
    setShowSampleData(checked)
    if (checked) {
      setCode(SAMPLE_CODE)
      setReviewResult(SAMPLE_RESULT)
      setError(null)
    } else {
      setCode('')
      setReviewResult(null)
      setError(null)
    }
  }, [])

  const displayResult = reviewResult
  const totalIssues = displayResult
    ? (displayResult.issue_counts?.security_total ?? 0) + (displayResult.issue_counts?.performance_total ?? 0) + (displayResult.issue_counts?.style_total ?? 0)
    : undefined

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Header totalIssues={totalIssues} />

        {/* Controls Bar */}
        <div className="max-w-6xl mx-auto px-4 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {displayResult && (
              <Button variant="outline" size="sm" onClick={handleNewReview} className="border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white">
                <FiRefreshCw className="w-3.5 h-3.5 mr-1.5" />
                New Review
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sample Data</span>
            <Switch checked={showSampleData} onCheckedChange={handleToggleSample} className="data-[state=checked]:bg-emerald-600" />
          </div>
        </div>

        {/* Main Content */}
        {!displayResult ? (
          <CodeInput
            code={code}
            setCode={setCode}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            loading={loading}
            onAnalyze={handleAnalyze}
            error={error}
          />
        ) : (
          <ReviewDashboard
            overallScore={displayResult.overall_score}
            summary={displayResult.summary}
            languageDetected={displayResult.language_detected}
            securityIssues={displayResult.security_issues}
            performanceIssues={displayResult.performance_issues}
            styleIssues={displayResult.style_issues}
            issueCounts={displayResult.issue_counts}
            topPriorities={displayResult.top_priorities}
          />
        )}

        {/* Agent Status */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-gray-800">
                  <FiShield className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-300">CodeGuard Code Review Agent</p>
                  <p className="text-xs text-gray-500">Security, performance, and style analysis</p>
                </div>
              </div>
              <Badge variant="outline" className={activeAgentId === AGENT_ID ? 'text-xs border-amber-500/30 text-amber-400 bg-amber-500/10' : 'text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10'}>
                {activeAgentId === AGENT_ID ? 'Analyzing...' : 'Ready'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
