import Sidebar from '@/components/Sidebar'
import TrialBanner from '@/components/TrialBanner'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TrialBanner />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto min-w-0">
          <main className="flex-1">{children}</main>
          <footer className="px-4 md:px-8 py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              <Link href="/mentions-legales" className="hover:text-gray-600 transition-colors">Mentions légales</Link>
              <Link href="/cgu" className="hover:text-gray-600 transition-colors">CGU</Link>
              <Link href="/cgv" className="hover:text-gray-600 transition-colors">CGV</Link>
              <Link href="/confidentialite" className="hover:text-gray-600 transition-colors">Confidentialité</Link>
              <a href="mailto:contact@voxibat.fr" className="hover:text-gray-600 transition-colors">contact@voxibat.fr</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
