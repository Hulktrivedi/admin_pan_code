'use client'

import { useState } from 'react'
import { Menu, X, ToggleLeft as Toggle } from 'lucide-react'
import Navigation from '@/components/navigation'

const coins = [
  'BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOGE', 'AVAX', 'MATIC', 'LINK',
  'DOT', 'UNI', 'ARB', 'OPTIMISM', 'FTM', 'CRON', 'ATOM', 'NEAR', 'FLOW', 'ICP',
  'ALGO', 'VET', 'THETA', 'SHIB', 'PEPE', 'WIF', 'FLOKI', 'BONK', 'BLUR', 'GMX',
]

export default function BotConfiguration() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [config, setConfig] = useState({
    riskPerTrade: 1.0,
    maxPositions: 10,
    minConfidence: 0.7,
    cooldownPeriod: 300,
    emergencyStop: false,
    testMode: false,
  })
  const [selectedCoins, setSelectedCoins] = useState<string[]>(coins)

  const toggleCoin = (coin: string) => {
    setSelectedCoins((prev) =>
      prev.includes(coin) ? prev.filter((c) => c !== coin) : [...prev, coin]
    )
  }

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
          <h1 className="text-2xl font-bold text-foreground">Bot Configuration</h1>
          <div className="w-10 h-10" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-8 max-w-4xl">
            {/* Risk Settings */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Risk Settings</h2>

              <div>
                <label className="block text-sm text-foreground mb-2">Risk Per Trade (%)</label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={config.riskPerTrade}
                  onChange={(e) => setConfig({ ...config, riskPerTrade: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Max Open Positions</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={config.maxPositions}
                  onChange={(e) => setConfig({ ...config, maxPositions: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">
                  Min Confidence Score: {config.minConfidence.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={config.minConfidence}
                  onChange={(e) => setConfig({ ...config, minConfidence: parseFloat(e.target.value) })}
                  className="w-full accent-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">Cooldown Period (seconds)</label>
                <input
                  type="number"
                  min="60"
                  max="3600"
                  step="60"
                  value={config.cooldownPeriod}
                  onChange={(e) => setConfig({ ...config, cooldownPeriod: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Emergency Controls */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Emergency Controls</h2>

              <div className="flex items-center justify-between p-4 bg-background rounded border border-border">
                <div>
                  <p className="text-foreground font-medium">Emergency Stop</p>
                  <p className="text-sm text-muted-foreground">Instantly halt all bot operations</p>
                </div>
                <label className="relative inline-block w-14 h-7">
                  <input
                    type="checkbox"
                    checked={config.emergencyStop}
                    onChange={(e) => setConfig({ ...config, emergencyStop: e.target.checked })}
                    className="sr-only"
                  />
                  <span className={`absolute inset-0 rounded-full transition-colors ${
                    config.emergencyStop ? 'bg-destructive' : 'bg-muted'
                  }`} />
                  <span className={`absolute left-1 top-1 w-5 h-5 bg-background rounded-full transition-transform ${
                    config.emergencyStop ? 'translate-x-7' : ''
                  }`} />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded border border-border">
                <div>
                  <p className="text-foreground font-medium">Test Mode</p>
                  <p className="text-sm text-muted-foreground">Filter signals by confidence threshold</p>
                </div>
                <label className="relative inline-block w-14 h-7">
                  <input
                    type="checkbox"
                    checked={config.testMode}
                    onChange={(e) => setConfig({ ...config, testMode: e.target.checked })}
                    className="sr-only"
                  />
                  <span className={`absolute inset-0 rounded-full transition-colors ${
                    config.testMode ? 'bg-accent' : 'bg-muted'
                  }`} />
                  <span className={`absolute left-1 top-1 w-5 h-5 bg-background rounded-full transition-transform ${
                    config.testMode ? 'translate-x-7' : ''
                  }`} />
                </label>
              </div>
            </div>

            {/* Pair Management */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Trading Pair Selection</h2>
              <p className="text-sm text-muted-foreground">
                {selectedCoins.length} of {coins.length} enabled
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {coins.map((coin) => (
                  <label
                    key={coin}
                    className={`flex items-center justify-center p-3 rounded border transition-all cursor-pointer ${
                      selectedCoins.includes(coin)
                        ? 'bg-accent border-accent text-accent-foreground'
                        : 'bg-background border-border text-foreground hover:border-accent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCoins.includes(coin)}
                      onChange={() => toggleCoin(coin)}
                      className="sr-only"
                    />
                    <span className="font-medium text-sm">{coin}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
