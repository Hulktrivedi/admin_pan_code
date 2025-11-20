'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, TrendingUp, Sliders, Activity, Menu, X } from 'lucide-react'
import { DashboardAPI, Trade } from '@/lib/api'

// Navigation Items (You can also move this to a separate component)
const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'User Management', icon: Users },
  { href: '/trades', label: 'Signals & Trades', icon: TrendingUp },
  { href: '/config', label: 'Bot Configuration', icon: Sliders },
  { href: '/health', label: 'System Health', icon: Activity },
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // --- REAL DATA STATE ---
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeSubscribers: 0,
    signalsToday: 0,
    openTrades: 0,
    botStatus: 'Online'
  })
  const [feed, setFeed] = useState<Trade[]>([])

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { users, trades } = await DashboardAPI.getData()
        
        const activeCount = users.filter(u => u.is_active).length
        
        const today = new Date().toISOString().split('T')[0]
        const todaySignals = trades.filter(t => t.created_at.startsWith(today)).length
        
        const openCount = trades.filter(t => t.status === 'ACTIVE').length

        setStats({
          activeSubscribers: activeCount,
          signalsToday: todaySignals,
          openTrades: openCount,
          botStatus: 'Online'
        })

        setFeed(trades.slice(0, 10))
        
      } catch (error) {
        console.error("Failed to load dashboard data", error)
        setStats(prev => ({ ...prev, botStatus: 'Offline' }))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed lg:static z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:translate-x-0`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-sidebar-border">
            <span className="text-sidebar-foreground font-bold text-xl">CryptoBot</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Total Active Subscribers" value={loading ? "..." : stats.activeSubscribers.toString()} change="Live" status="up" />
              <MetricCard title="Signals Today" value={loading ? "..." : stats.signalsToday.toString()} change="Since 00:00 UTC" status="neutral" />
              <MetricCard title="Bot Status" value={stats.botStatus} change="SystemD Service" status={stats.botStatus === 'Online' ? 'up' : 'down'} />
              <MetricCard title="Current Open Trades" value={loading ? "..." : stats.openTrades.toString()} change="Active Positions" status="neutral" />
            </div>

            {/* Live Feed */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? <p>Loading...</p> : feed.map((trade) => (
                    <FeedItem 
                      key={trade.id}
                      time={new Date(trade.created_at).toLocaleTimeString()}
                      message={`${trade.signal_type} ${trade.pair} @ ${trade.entry_price}`}
                      status={trade.status}
                    />
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, status }: any) {
  const statusColor = status === 'up' ? 'text-green-400' : status === 'down' ? 'text-red-400' : 'text-gray-400'
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      <p className={`text-sm ${statusColor}`}>{change}</p>
    </div>
  )
}

function FeedItem({ time, message, status }: any) {
  return (
    <div className="flex gap-4 pb-3 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground w-20">{time}</span>
      <div className="flex-1 flex justify-between">
        <span className="text-sm font-medium">{message}</span>
        <span className="text-xs px-2 py-1 rounded bg-muted">{status}</span>
      </div>
    </div>
  )
}