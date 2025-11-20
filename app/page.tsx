'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, TrendingUp, Sliders, Activity, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'User Management', icon: Users },
  { href: '/trades', label: 'Signals & Trades', icon: TrendingUp },
  { href: '/config', label: 'Bot Configuration', icon: Sliders },
  { href: '/health', label: 'System Health', icon: Activity },
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed lg:static z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold">₿</span>
              </div>
              <span className="text-sidebar-foreground font-bold text-xl">CryptoBot</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="px-4 py-3 bg-sidebar-accent bg-opacity-10 rounded-lg">
              <p className="text-xs text-sidebar-foreground opacity-70">Status</p>
              <p className="text-sm font-semibold text-green-400">🟢 Online</p>
            </div>
          </div>
        </div>
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
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="w-10 h-10 bg-muted rounded-full" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Active Subscribers"
                value="142"
                change="+12%"
                status="up"
              />
              <MetricCard
                title="Signals Today"
                value="5"
                change="1 pending"
                status="neutral"
              />
              <MetricCard
                title="Bot Status"
                value="Online"
                change="142h uptime"
                status="up"
              />
              <MetricCard
                title="Current Open Trades"
                value="3"
                change="$2,450 exposure"
                status="neutral"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Profit/Loss (30 Days)</h2>
                <div className="h-48 bg-muted bg-opacity-20 rounded flex items-center justify-center text-muted-foreground">
                  Chart Placeholder
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Win/Loss Ratio</h2>
                <div className="h-48 bg-muted bg-opacity-20 rounded flex items-center justify-center text-muted-foreground">
                  Chart Placeholder
                </div>
              </div>
            </div>

            {/* Live Feed Widget */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Live Feed</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <FeedItem time="14:32:18" message="BTC/USDT signal generated - Confidence: 0.87" />
                <FeedItem time="14:15:45" message="Position closed: ETH/USDT +245 USDT" />
                <FeedItem time="14:02:30" message="User @trader_john subscribed" />
                <FeedItem time="13:58:12" message="New signal: BNB/USDT entry @598.50" />
                <FeedItem time="13:45:00" message="Risk check passed - opening position" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, status }: {
  title: string
  value: string
  change: string
  status: 'up' | 'down' | 'neutral'
}) {
  const statusColor = status === 'up' ? 'text-green-400' : status === 'down' ? 'text-red-400' : 'text-accent'

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors">
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      <p className={`text-sm ${statusColor}`}>{change}</p>
    </div>
  )
}

function FeedItem({ time, message }: { time: string; message: string }) {
  return (
    <div className="flex gap-4 pb-3 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
      <span className="text-sm text-foreground">{message}</span>
    </div>
  )
}
