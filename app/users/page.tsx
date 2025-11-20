'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, TrendingUp, Sliders, Activity, Menu, X, Plus, Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import Navigation from '@/components/navigation'

const mockUsers = [
  { id: 1, username: '@trader_alpha', telegramId: '123456789', expiry: '2025-02-15', joined: '2024-08-10', active: true },
  { id: 2, username: '@crypto_investor', telegramId: '987654321', expiry: '2025-01-20', joined: '2024-07-22', active: true },
  { id: 3, username: '@signal_seeker', telegramId: '456123789', expiry: '2024-12-30', joined: '2024-06-05', active: false },
  { id: 4, username: '@bot_master', telegramId: '789456123', expiry: '2025-03-01', joined: '2024-09-14', active: true },
  { id: 5, username: '@moon_walker', telegramId: '321654987', expiry: '2025-01-10', joined: '2024-08-28', active: true },
]

export default function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [hiddenIds, setHiddenIds] = useState<number[]>([])

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telegramId.includes(searchTerm)
  )

  const toggleTelegramVisibility = (id: number) => {
    setHiddenIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    )
  }

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
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
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Search Bar */}
            <div>
              <input
                type="text"
                placeholder="Search by username or Telegram ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted bg-opacity-20 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Username</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Telegram ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Expiry Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Joined</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted hover:bg-opacity-20 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`inline-block w-2 h-2 rounded-full ${user.active ? 'bg-green-400' : 'bg-red-400'}`} />
                        </td>
                        <td className="px-6 py-4 text-foreground font-medium">{user.username}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-mono text-sm">
                              {hiddenIds.includes(user.id)
                                ? '••••••••••'
                                : user.telegramId}
                            </span>
                            <button
                              onClick={() => toggleTelegramVisibility(user.id)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              {hiddenIds.includes(user.id) ? (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(user.telegramId, user.id)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Copy className={`w-4 h-4 ${copiedId === user.id ? 'text-green-400' : 'text-muted-foreground'}`} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground">{user.expiry}</td>
                        <td className="px-6 py-4 text-foreground text-sm text-muted-foreground">{user.joined}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-accent text-accent-foreground rounded text-sm hover:opacity-90 transition-opacity">
                              +30d
                            </button>
                            <button className="p-1 hover:bg-destructive hover:bg-opacity-20 rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">Add New User</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Telegram ID"
                className="w-full px-4 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="date"
                className="w-full px-4 py-2 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-muted text-foreground rounded hover:opacity-80 transition-opacity"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity">
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
