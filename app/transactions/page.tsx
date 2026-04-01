import DashboardShell from '@/components/layout/DashboardShell'
import TransactionsView from '@/components/transactions/TransactionsView'
import HydrationGuard from '@/components/layout/HydrationGuard'

export const metadata = { title: 'Transactions | Luminous Ledger' }

export default function TransactionsPage() {
  return (
    <DashboardShell title="Transactions">
      <HydrationGuard>
        <TransactionsView />
      </HydrationGuard>
    </DashboardShell>
  )
}
