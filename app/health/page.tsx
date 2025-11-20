'use client'

import { useState } from 'react'
import { Menu, X, RefreshCw } from 'lucide-react'
import Navigation from '@/components/navigation'

function HealthMetric({ title, value, status }: { title: string; value: string; status: 'normal' | 'warning' | 'critical' }) {
  const statusStyles = {
    normal: 'bg-green-400 bg-opacity-20 text-green-400',
    warning: 'bg-yellow-500 bg-opacity-20 text-yellow-500',
    critical: 'bg-red-400 bg-opacity-20 text-red-400',
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
      <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
    </div>
  )
}

export default function SystemHealth() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [logContent, setLogContent] = useState(`[2024-11-18 14:32:18] Bot initialized successfully
[2024-11-18 14:32:25] Connected to Binance API
[2024-11-18 14:33:01] ML model loaded from cache
[2024-11-18 14:33:45] BTC/USDT signal generated - Confidence: 0.87
[2024-11-18 14:34:12] Position opened: BTC/USDT Entry: 42150
[2024-11-18 14:35:30] ETH/USDT signal generated - Confidence: 0.92
[2024-11-18 14:36:15] Risk check passed
[2024-11-18 14:37:00] Maintenance task completed
[2024-11-18 14:38:22] API latency normal
[2024-11-18 14:39:45] All systems healthy`)

  return (
    <div className="flex h-screen bg-background">
      <Navigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-2xl font-bold text-foreground">System Health</h1>
          <div className="w-10 h-10" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 max-w-4xl">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HealthMetric title="Server RAM Usage" value="42%" status="normal" />
              <HealthMetric title="Disk Usage" value="68%" status="warning" />
              <HealthMetric title="API Latency" value="145ms" status="normal" />
              <HealthMetric title="Last Heartbeat" value="2s ago" status="normal" />
            </div>

            {/* Logs Viewer */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">System Logs</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>

              <div className="bg-background rounded border border-border p-4 h-96 overflow-y-auto font-mono text-sm">
                {logContent.split('\n').map((line, idx) => (
                  <div key={idx} className="text-muted-foreground hover:text-foreground transition-colors">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
