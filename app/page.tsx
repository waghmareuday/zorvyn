import DashboardShell from '@/components/layout/DashboardShell'
import DashboardContent from '@/components/dashboard/DashboardContent'
import HydrationGuard from '@/components/layout/HydrationGuard'

export const metadata = { title: 'Overview | Luminous Ledger' }

export default function Home() {
  return (
    <DashboardShell title="Portfolio Health">
      <HydrationGuard>
        <DashboardContent />
      </HydrationGuard>
    </DashboardShell>
  )
}
