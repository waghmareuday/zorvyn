import DashboardShell from '@/components/layout/DashboardShell'
import InsightsView from '@/components/insights/InsightsView'
import HydrationGuard from '@/components/layout/HydrationGuard'

export const metadata = { title: 'Insights | Luminous Ledger' }

export default function InsightsPage() {
  return (
    <DashboardShell title="Insights">
      <HydrationGuard>
        <InsightsView />
      </HydrationGuard>
    </DashboardShell>
  )
}
