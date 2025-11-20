'use client'

import { useState, useEffect } from 'react'
import { Menu, X, RefreshCw } from 'lucide-react'
// import Navigation from '@/components/navigation' // Make sure this path is correct or use the sidebar code provided earlier
import Link from 'next/link'
import { SystemAPI } from '@/lib/api'

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
  const [loading, setLoading] = useState(true)
  
  // --- REAL DATA STATE ---
  const [logs, setLogs] = useState<string[]>([])
  const [metrics, setMetrics] = useState({
    ram: 0,
    disk: 0,
    latency: 0,
    heartbeat: 'Never'
  })

  const fetchHealthData = async () => {
    setLoading(true)
    try {
      // In a real scenario, you'd call SystemAPI.getHealth()
      // Since we haven't built the Python backend for RAM/Disk usage yet, 
      // we will simulate the metrics but fetch REAL logs if available.
      
      // For now, we simulate the API call for metrics to prevent crashing
      // const health = await SystemAPI.getHealth() 
      
      // Simulate Data (Replace with await SystemAPI.getHealth() when backend is ready)
      const mockRam = Math.floor(Math.random() * (60 - 30) + 30)
      const mockDisk = 45 // Static for now
      const mockLatency = Math.floor(Math.random() * (200 - 50) + 50)
      
      setMetrics({
        ram: mockRam,
        disk: mockDisk,
        latency: mockLatency,
        heartbeat: new Date().toLocaleTimeString()
      })

      // Try to fetch logs (This requires the backend endpoint we defined)
      // If backend isn't ready, fall back to a placeholder
      try {
        const realLogs = await SystemAPI.getLogs()
        setLogs(realLogs)
      } catch (e) {
        setLogs([`[${new Date().toLocaleTimeString()}] System check completed`, ...logs.slice(0, 10)])
      }

    } catch (error) {
      console.error("Failed to fetch health data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealthData()
    const interval = setInterval(fetchHealthData, 30000) // 30s refresh
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar (Simplified) */}
      <div className={`fixed lg:static z-50 w-64 bg-sidebar border-r border-sidebar-border ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
         <div className="p-6 border-b border-sidebar-border font-bold text-xl">CryptoBot</div>
         <nav className="p-4 space-y-2">
            <Link href="/" className="block px-4 py-2 rounded hover:bg-muted">Dashboard</Link>
            <Link href="/users" className="block px-4 py-2 rounded hover:bg-muted">User Management</Link>
            <Link href="/trades" className="block px-4 py-2 rounded hover:bg-muted">Signals & Trades</Link>
            <Link href="/health" className="block px-4 py-2 rounded bg-accent text-white">System Health</Link>
         </nav>
      </div>

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
              <HealthMetric 
                title="Server RAM Usage" 
                value={`${metrics.ram}%`} 
                status={metrics.ram > 80 ? 'critical' : metrics.ram > 60 ? 'warning' : 'normal'} 
              />
              <HealthMetric 
                title="Disk Usage" 
                value={`${metrics.disk}%`} 
                status={metrics.disk > 80 ? 'critical' : metrics.disk > 60 ? 'warning' : 'normal'} 
              />
              <HealthMetric 
                title="API Latency" 
                value={`${metrics.latency}ms`} 
                status={metrics.latency > 500 ? 'warning' : 'normal'} 
              />
              <HealthMetric 
                title="Last Heartbeat" 
                value={metrics.heartbeat} 
                status="normal" 
              />
            </div>

            {/* Logs Viewer */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">System Logs</h2>
                <button 
                    onClick={fetchHealthData}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              <div className="bg-background rounded border border-border p-4 h-96 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                    <div className="text-muted-foreground">No logs available.</div>
                ) : (
                    logs.map((line, idx) => (
                    <div key={idx} className="text-muted-foreground hover:text-foreground transition-colors border-b border-border/50 py-1">
                        {line}
                    </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}