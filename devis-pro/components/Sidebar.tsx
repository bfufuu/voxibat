import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Quotio</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <span>📊</span> Tableau de bord
        </Link>
        <Link
          href="/devis"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <span>📄</span> Mes devis
        </Link>
        <Link
          href="/devis/nouveau"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <span>➕</span> Nouveau devis
        </Link>
        <Link
          href="/factures"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <span>🧾</span> Mes factures
        </Link>
        <Link
          href="/tarifs"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <span>💰</span> Mes tarifs
        </Link>
        <Link
          href="/profil"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <span>👤</span> Mon profil
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </aside>
  )
}
