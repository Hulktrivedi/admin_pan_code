'use client'

import { useState } from 'react'
import { Menu, X, Download } from 'lucide-react'
import Navigation from '@/components/navigation'

const activeTrades = [
  { id: 1, pair: 'BTC/USDT', entry: 42150, current: 42320, pnl: 170, pnlPct: 0.40 },
  { id: 2, pair: 'ETH/USDT', entry: 2245, current: 2198, pnl: -47, pnlPct: -2.09 },
  { id: 3, pair: 'BNB/USDT', entry: 615, current: 628, pnl: 13, pnlPct: 2.11 },
]

const tradeHistory = [
  { id: 1, pair: 'SOL/USDT', entry: 185.50, exit: 192.30, pnl: 68.80, date: '2024-11-16' },
  { id: 2, pair: 'ADA/USDT', entry: 1.12, exit: 1.08, pnl: -40, date: '2024-11-15' },
  { id: 3, pair: 'DOGE/USDT', entry: 0.42, exit: 0.44, pnl: 20, date: '2024-11-14' },
]

const signalLogs = [
  { id: 1, time: '14:32:18', pair: 'BTC/USDT', signal: 'BUY', confidence: 0.87, status: 'accepted' },
  { id: 2, time: '14:15:45', pair: 'ETH/USDT', signal: 'SELL', confidence: 0.92, status: 'accepted' },
  { id: 3, time: '14:02:30', pair: 'BNB/USDT', signal: 'BUY', confidence: 0.45, status: 'rejected' },
]

export default function SignalsAndTrades() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('active')

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
          <h1 className="text-2xl font-bold text-foreground">Signals & Trades</h1>
          <div className="w-10 h-10" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
              {[
                { id: 'active', label: 'Active Trades' },
                { id: 'history', label: 'Trade History' },
                { id: 'signals', label: 'Signal Logs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Trades */}
            {activeTab === 'active' && (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted bg-opacity-20 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Pair</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Entry Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Current Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Unrealized PnL</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTrades.map((trade) => (
                        <tr key={trade.id} className="border-b border-border hover:bg-muted hover:bg-opacity-20">
                          <td className="px-6 py-4 text-foreground font-medium">{trade.pair}</td>
                          <td className="px-6 py-4 text-foreground">${trade.entry.toLocaleString()}</td>
                          <td className="px-6 py-4 text-foreground">${trade.current.toLocaleString()}</td>
                          <td className={`px-6 py-4 font-semibold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${trade.pnl.toFixed(2)} ({trade.pnlPct >= 0 ? '+' : ''}{trade.pnlPct.toFixed(2)}%)
                          </td>
                          <td className="px-6 py-4">
                            <button className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:opacity-90 transition-opacity">
                              Panic Close
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Trade History */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity">
                  <Download className="w-5 h-5" />
                  Download CSV
                </button>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted bg-opacity-20 border-b border-border">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Pair</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Entry</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Exit</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Final PnL</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tradeHistory.map((trade) => (
                          <tr key={trade.id} className="border-b border-border hover:bg-muted hover:bg-opacity-20">
                            <td className="px-6 py-4 text-foreground font-medium">{trade.pair}</td>
                            <td className="px-6 py-4 text-foreground">${trade.entry.toFixed(2)}</td>
                            <td className="px-6 py-4 text-foreground">${trade.exit.toFixed(2)}</td>
                            <td className={`px-6 py-4 font-semibold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              ${trade.pnl.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{trade.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Signal Logs */}
            {activeTab === 'signals' && (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted bg-opacity-20 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Time</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Pair</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Signal</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Confidence</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signalLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border hover:bg-muted hover:bg-opacity-20">
                          <td className="px-6 py-4 text-foreground font-mono text-sm">{log.time}</td>
                          <td className="px-6 py-4 text-foreground font-medium">{log.pair}</td>
                          <td className={`px-6 py-4 font-semibold ${log.signal === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                            {log.signal}
                          </td>
                          <td className="px-6 py-4 text-foreground">{(log.confidence * 100).toFixed(0)}%</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded text-sm font-medium ${
                              log.status === 'accepted'
                                ? 'bg-green-400 bg-opacity-20 text-green-400'
                                : 'bg-red-400 bg-opacity-20 text-red-400'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
