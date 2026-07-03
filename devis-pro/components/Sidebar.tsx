'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Tableau de bord' },
  { href: '/devis', icon: '📄', label: 'Mes devis' },
  { href: '/devis/nouveau', icon: '➕', label: 'Nouveau devis' },
  { href: '/factures', icon: '🧾', label: 'Mes factures' },
  { href: '/tarifs', icon: '💰', label: 'Mes tarifs' },
  { href: '/profil', icon: '👤', label: 'Mon profil' },
  { href: '/contact', icon: '💬', label: 'Contact' },
]

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
        >
          <span>🚪</span> Se déconnecter
        </button>
      </div>
    </>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Bouton hamburger fixe en haut à gauche sur mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-3 left-3 z-30 p-2 rounded-lg bg-white/90 backdrop-blur shadow-sm text-gray-600"
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay mobile */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer mobile */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">Voxibat</span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <NavLinks onClose={() => setOpen(false)} />
      </div>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col min-h-screen">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Voxibat</h1>
        </div>
        <NavLinks />
      </aside>
    </>
  )
}
