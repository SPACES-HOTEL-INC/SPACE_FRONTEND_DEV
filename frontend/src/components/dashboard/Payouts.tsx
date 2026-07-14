import { useState } from 'react'
import {
  Wallet,
  TrendingUp,
  Clock,
  Landmark,
  ChevronDown,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  XCircle,
} from 'lucide-react'
import { cn, money } from '../../lib/ui'
import { PAYOUT_FINANCE, BANK_OPTIONS, PAYOUT_HISTORY } from '../../data/mockData'
import type { PayoutStatus } from '../../types'

interface PayoutsProps {
  onNotify: (title: string, message: string) => void
}

const MIN_WITHDRAWAL = 50

const PAYOUT_STATUS_STYLES: Record<PayoutStatus, string> = {
  Processing: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Failed: 'bg-red-50 text-red-600 ring-red-600/20',
}
const PAYOUT_STATUS_ICON = { Processing: Loader2, Completed: CheckCircle2, Failed: XCircle }

/**
 * Payouts — the revenue center.
 *
 * Derived money:
 *   Available Balance = TotalIncome − (PlatformFee + PendingClearance + Withdrawn)
 * The "Request Withdrawal" button is disabled whenever Available < $50.
 *
 * State flow: bank settings are local controlled inputs; "Save Payout Details"
 * and "Request Withdrawal" both surface a toast via onNotify. The historic
 * ledger is static mock data.
 */
export default function Payouts({ onNotify }: PayoutsProps) {
  const { totalIncome, platformFee, pendingClearance, withdrawnFunds } = PAYOUT_FINANCE
  const available = totalIncome - (platformFee + pendingClearance + withdrawnFunds)
  const canWithdraw = available >= MIN_WITHDRAWAL

  const [bank, setBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')

  const widgets = [
    { id: 'total', label: 'Total Earnings', value: totalIncome, icon: TrendingUp, tone: 'default' as const, sub: 'Gross income to date' },
    { id: 'available', label: 'Available Balance', value: available, icon: Wallet, tone: 'success' as const, sub: 'Ready to withdraw' },
    { id: 'pending', label: 'Pending Clearance', value: pendingClearance, icon: Clock, tone: 'default' as const, sub: 'Clearing in 1–3 days' },
  ]

  const handleSaveBank = () => onNotify('Payout details saved', 'Your bank information has been updated')
  const handleWithdraw = () => {
    if (!canWithdraw) return
    onNotify('Withdrawal requested', `${money(available)} is being processed to your bank`)
  }

  return (
    <section data-testid="payouts-panel">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Payouts</h2>
        <p className="mt-1 text-sm text-slate-500">Track earnings, manage bank details and withdraw funds</p>
      </div>

      {/* Financial widgets */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
        {widgets.map((w) => {
          const success = w.tone === 'success'
          const Icon = w.icon
          return (
            <div
              key={w.id}
              className={cn(
                'rounded-2xl border p-5 shadow-card sm:p-6',
                success ? 'border-emerald-200 bg-emerald-50/60' : 'border-line bg-white',
              )}
              data-testid={`payout-widget-${w.id}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{w.label}</span>
                <span className={cn('grid h-9 w-9 place-items-center rounded-lg', success ? 'bg-emerald-600 text-white' : 'bg-brand-600/10 text-brand-600')}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-ink" data-testid={`payout-value-${w.id}`}>
                {money(w.value)}
              </p>
              <p className="mt-1 text-xs text-slate-500">{w.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Bank settings */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6 lg:col-span-3">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600/10 text-brand-600">
              <Landmark className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-ink">Bank Settings</h3>
              <p className="text-xs text-slate-500">Where your payouts are deposited</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="bank-name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Bank Name
              </label>
              <div className="relative">
                <select
                  id="bank-name"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-line bg-white px-4 py-3 pr-10 text-[15px] text-ink focus-ring"
                  data-testid="bank-name-select"
                >
                  <option value="" disabled>
                    Select your bank
                  </option>
                  {BANK_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="account-number" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Account Number
                </label>
                <input
                  id="account-number"
                  type="number"
                  inputMode="numeric"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="0000 0000 0000"
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-slate-400 focus-ring"
                  data-testid="account-number-input"
                />
              </div>
              <div>
                <label htmlFor="account-name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Account Name
                </label>
                <input
                  id="account-name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Account holder name"
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-slate-400 focus-ring"
                  data-testid="account-name-input"
                />
              </div>
            </div>

            <button
              onClick={handleSaveBank}
              className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              data-testid="save-payout-details-button"
            >
              Save Payout Details
            </button>
          </div>
        </div>

        {/* Withdrawal card */}
        <div className="flex flex-col rounded-2xl border border-line bg-ink p-5 text-white shadow-card sm:p-6 lg:col-span-2">
          <p className="text-sm font-medium text-slate-300">Available to withdraw</p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight" data-testid="withdrawal-available">
            {money(available)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Minimum withdrawal is {money(MIN_WITHDRAWAL)}</p>

          <div className="mt-auto pt-6">
            <button
              onClick={handleWithdraw}
              disabled={!canWithdraw}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.9)] transition-all duration-200 hover:bg-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-400/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400 disabled:shadow-none"
              data-testid="request-withdrawal-button"
            >
              <ArrowUpRight className="h-5 w-5" /> Request Withdrawal
            </button>
            {!canWithdraw && (
              <p className="mt-2 text-center text-xs text-amber-300">
                Balance below {money(MIN_WITHDRAWAL)} — withdrawal unavailable
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Historic ledger */}
      <div className="mt-6 rounded-2xl border border-line bg-white shadow-card">
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <h3 className="text-base font-extrabold tracking-tight text-ink">Payout History</h3>
          <p className="text-xs text-slate-500">Your past withdrawals</p>
        </div>

        <div className="hidden grid-cols-[1fr_1fr_1.4fr_auto] gap-4 border-b border-line px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:grid">
          <span>Date</span>
          <span>Amount</span>
          <span>Reference ID</span>
          <span className="text-right">Status</span>
        </div>

        <div className="divide-y divide-line">
          {PAYOUT_HISTORY.map((p) => {
            const Icon = PAYOUT_STATUS_ICON[p.status]
            return (
              <div
                key={p.id}
                className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-[1fr_1fr_1.4fr_auto] sm:items-center sm:gap-4 sm:px-6"
                data-testid={`payout-history-row-${p.id}`}
              >
                <div className="text-sm font-medium text-slate-700">{p.date}</div>
                <div className="text-sm font-bold text-ink">{money(p.amount)}</div>
                <div className="font-mono text-xs text-slate-500 sm:text-sm">{p.reference}</div>
                <div className="col-span-2 sm:col-span-1 sm:text-right">
                  <span
                    className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1', PAYOUT_STATUS_STYLES[p.status])}
                    data-testid={`payout-status-${p.id}`}
                  >
                    <Icon className={cn('h-3.5 w-3.5', p.status === 'Processing' && 'animate-spin')} />
                    {p.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
