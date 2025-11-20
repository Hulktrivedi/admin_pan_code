'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Download, RefreshCw, AlertOctagon } from 'lucide-react'
import Link from 'next/link'
import { TradeAPI, Trade } from '@/lib/api'

// --- MOCK DATA (For Signal Logs Only) ---
// We keep this separate because we haven't built the 'signal_logs' API endpoint yet.
const mockSignalLogs = [
  { id: 101, created_at: new Date().toISOString(), pair: 'BTC/USDT', signal_type: 'BUY', confidence: 0.87, status: 'ACTIVE' },
  { id: 102, created_at: new Date().toISOString(), pair: 'ETH/USDT', signal_type: 'SELL', confidence: 0.92, status: 'CLOSED' },
]

export default function SignalsAndTrades() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('active')

  // --- REAL DATA STATE ---
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  // --- FETCH DATA ---
  const fetchTrades = async () => {
    setLoading(true)
    try {
      const data = await TradeAPI.getAll(100)
      setTrades(data)
    } catch (error) {
      console.error("Failed to fetch trades", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrades()
    const interval = setInterval(fetchTrades, 10000)
    return () => clearInterval(interval)
  }, [])

  // --- FILTERING ---
  const activeTrades = trades.filter(t => t.status === 'ACTIVE')
  const tradeHistory = trades.filter(t => t.status !== 'ACTIVE')
  
  // Combine real trades with mock signals for the third tab
  // In production, you'd fetch real signal logs here
  const signalLogs = [...trades, ...mockSignalLogs].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  // --- ACTIONS ---
  const handlePanicClose = async (id: number) => {
    if(confirm("Force close this trade at market price?")) {
        try {
            await TradeAPI.closeTrade(id)
            fetchTrades()
        } catch (e) {
            alert("Failed to close trade")
        }
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Placeholder */}
      <div className={`fixed lg:static z-50 w-64 bg-sidebar border-r border-sidebar-border ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:translate-x-0`}>
         <div className="p-6 border-b border-sidebar-border font-bold text-xl">CryptoBot</div>
         <nav className="p-4 space-y-2">
            <Link href="/" className="block px-4 py-2 rounded hover:bg-muted">Dashboard</Link>
            <Link href="/users" className="block px-4 py-2 rounded hover:bg-muted">User Management</Link>
            <Link href="/trades" className="block px-4 py-2 rounded bg-accent text-white">Signals & Trades</Link>
            <Link href="/config" className="block px-4 py-2 rounded hover:bg-muted">Configuration</Link>
            <Link href="/health" className="block px-4 py-2 rounded hover:bg-muted">System Health</Link>
         </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-muted rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Signals & Trades</h1>
            <button onClick={fetchTrades} className="p-2 hover:bg-muted rounded-full" title="Refresh">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}/>
            </button>
          </div>
          <div className="w-10 h-10" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
              {[
                { id: 'active', label: `Active Trades (${activeTrades.length})` },
                { id: 'history', label: 'Trade History' },
                { id: 'signals', label: 'Signal Logs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium transition-colors ${
                    activeTab === tab.id ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground hover:text-foreground'
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
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted bg-opacity-20 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Pair</th>
                        <th className="px-6 py-3 font-semibold">Type</th>
                        <th className="px-6 py-3 font-semibold">Entry</th>
                        <th className="px-6 py-3 font-semibold">PnL</th>
                        <th className="px-6 py-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {activeTrades.length === 0 ? (
                        <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No open positions.</td></tr>
                      ) : (
                      activeTrades.map((trade) => (
                        <tr key={trade.id} className="hover:bg-muted/20">
                          <td className="px-6 py-4 font-bold">{trade.pair}</td>
                          <td className={`px-6 py-4 font-bold ${trade.signal_type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.signal_type}
                          </td>
                          <td className="px-6 py-4">${trade.entry_price}</td>
                          
                          {/* Corrected PnL Logic: Only shows if trade has PnL data */}
                          <td className={`px-6 py-4 font-semibold ${(trade.pnl_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.pnl_percent ? `${trade.pnl_percent.toFixed(2)}%` : '0.00%'}
                          </td>

                          <td className="px-6 py-4">
                            <button 
                                onClick={() => handlePanicClose(trade.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:opacity-90 transition-opacity"
                            >
                                <AlertOctagon className="w-3 h-3"/> Close
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Trade History */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity">
                  <Download className="w-5 h-5" /> Download CSV
                </button>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted bg-opacity-20 border-b border-border">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Pair</th>
                          <th className="px-6 py-3 font-semibold">Type</th>
                          <th className="px-6 py-3 font-semibold">Entry</th>
                          <th className="px-6 py-3 font-semibold">Exit</th>
                          <th className="px-6 py-3 font-semibold">Final PnL</th>
                          <th className="px-6 py-3 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {tradeHistory.map((trade) => (
                          <tr key={trade.id} className="hover:bg-muted/20">
                            <td className="px-6 py-4 font-medium">{trade.pair}</td>
                            <td className={`px-6 py-4 font-bold ${trade.signal_type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                {trade.signal_type}
                            </td>
                            <td className="px-6 py-4">${trade.entry_price}</td>
                            <td className="px-6 py-4">${trade.exit_price || '-'}</td>
                            <td className={`px-6 py-4 font-semibold ${(trade.pnl_percent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {trade.pnl_percent ? `${trade.pnl_percent.toFixed(2)}%` : '0.00%'}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                                {new Date(trade.created_at).toLocaleDateString()}
                            </td>
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
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted bg-opacity-20 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Time</th>
                        <th className="px-6 py-3 font-semibold">Pair</th>
                        <th className="px-6 py-3 font-semibold">Signal</th>
                        <th className="px-6 py-3 font-semibold">Strategy</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {signalLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-muted/20">
                          <td className="px-6 py-4 font-mono text-muted-foreground">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 font-medium">{log.pair}</td>
                          <td className={`px-6 py-4 font-bold ${log.signal_type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                            {log.signal_type}
                          </td>
                          <td className="px-6 py-4">{log.strategy || 'ML'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded text-xs font-semibold ${
                                log.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400' :
                                log.status === 'CLOSED' ? 'bg-green-500/20 text-green-400' :
                                'bg-yellow-500/20 text-yellow-400'
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