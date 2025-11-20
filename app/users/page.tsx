'use client'

import { useState, useEffect } from 'react'
import { Menu, Plus, Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import { UserAPI, User } from '@/lib/api'
import Link from 'next/link'

export default function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ username: '', telegramId: '', days: 30 })
  const [hiddenIds, setHiddenIds] = useState<number[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await UserAPI.getAll()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.telegramId) return
    try {
      await UserAPI.create({
        username: newUser.username,
        telegram_chat_id: parseInt(newUser.telegramId),
        days_valid: newUser.days
      })
      setShowAddModal(false)
      setNewUser({ username: '', telegramId: '', days: 30 })
      fetchUsers()
    } catch (error) {
      alert("Failed to add user. ID might exist.")
    }
  }

  const toggleStatus = async (id: number) => {
    try {
      await UserAPI.toggleStatus(id)
      fetchUsers()
    } catch (error) {
      console.error(error)
    }
  }

  const toggleVisibility = (id: number) => {
    setHiddenIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <div className="flex h-screen bg-background">
       {/* Sidebar Placeholder */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border hidden lg:block">
        <div className="p-6 border-b border-sidebar-border font-bold text-xl">CryptoBot</div>
        <nav className="p-4 space-y-2">
           <Link href="/" className="block px-4 py-2 rounded hover:bg-muted">Dashboard</Link>
           <Link href="/users" className="block px-4 py-2 rounded bg-accent text-white">User Management</Link>
           <Link href="/trades" className="block px-4 py-2 rounded hover:bg-muted">Signals & Trades</Link>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Management</h1>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg">
            <Plus className="w-5 h-5" /> Add User
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Telegram ID</th>
                  <th className="px-6 py-3">Expiry</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? <tr><td colSpan={5} className="p-6 text-center">Loading...</td></tr> : 
                 users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4 cursor-pointer" onClick={() => toggleStatus(user.id)}>
                      <span className={`inline-block w-3 h-3 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                    </td>
                    <td className="px-6 py-4 font-medium">{user.username}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <span className="font-mono">{hiddenIds.includes(user.id) ? '••••••' : user.telegram_chat_id}</span>
                      <button onClick={() => toggleVisibility(user.id)} className="p-1 hover:bg-muted rounded">
                        {hiddenIds.includes(user.id) ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}
                      </button>
                    </td>
                    <td className="px-6 py-4">{user.subscription_end || 'Lifetime'}</td>
                    <td className="px-6 py-4">
                      <button className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-96 space-y-4 border border-border">
            <h2 className="text-xl font-bold">Add New User</h2>
            <input 
              placeholder="Username" 
              className="w-full p-2 border rounded bg-background"
              value={newUser.username}
              onChange={e => setNewUser({...newUser, username: e.target.value})}
            />
            <input 
              placeholder="Telegram Chat ID" 
              type="number"
              className="w-full p-2 border rounded bg-background"
              value={newUser.telegramId}
              onChange={e => setNewUser({...newUser, telegramId: e.target.value})}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded hover:bg-muted">Cancel</button>
              <button onClick={handleAddUser} className="px-4 py-2 bg-accent text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}