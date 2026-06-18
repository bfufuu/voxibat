import Sidebar from '@/components/Sidebar'
import TrialBanner from '@/components/TrialBanner'

export default function TarifsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <TrialBanner />
        {children}
      </main>
    </div>
  )
}
