'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, TrendingUp, Sliders, Activity } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'User Management', icon: Users },
  { href: '/trades', label: 'Signals & Trades', icon: TrendingUp },
  { href: '/config', label: 'Bot Configuration', icon: Sliders },
  { href: '/health', label: 'System Health', icon: Activity },
]

export default function Navigation({ sidebarOpen, setSidebarOpen }: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}) {
  const pathname = usePathname()

  return (
    <div
      className={`fixed lg:static z-50 w-64 h-screen bg-sidebar border-r border-sidebar-border transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
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
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith('/') && item.href === '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
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
  )
}
