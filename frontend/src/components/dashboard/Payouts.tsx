import { useEffect, useState } from 'react'
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
  ShieldAlert,
  BadgeCheck,
  Info,
} from 'lucide-react'
import { cn } from '../../lib/ui'
import { PAYOUT_FINANCE, BANK_OPTIONS, PAYOUT_HISTORY, NGN_RATE } from '../../data/mockData'
import type { PayoutStatus } from '../../types'

interface PayoutsProps {
  onNotify: (title: string, message: string) => void
}

type Currency = 'USD' | 'NGN'
const MIN_WITHDRAWAL_USD = 50

const PAYOUT_STATUS_STYLES: Record<PayoutStatus, string> = {
  Processing: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Failed: 'bg-red-50 text-red-600 ring-red-600/20',
}
const PAYOUT_STATUS_ICON = { Processing: Loader2, Completed: CheckCircle2, Failed: XCircle }

/**
 * Payouts — the revenue center with dual-currency analytics + KYC gating.
 *
 * State flow:
 *  • `currency` ('USD' | 'NGN') → toggled by the top-right switch; `fmt()` renders
 *    every figure in the active currency (NGN = USD * NGN_RATE).
 *  • Bank form: `bank`, `accountNumber`, plus derived `verifying`/`verified`. When
 *    the account number hits EXACTLY 10 digits we show a "Verifying NUBAN…" loader
 *    then a read-only verified account name.
 *  • `bankSaved` → set true on "Save Payout Details". This hides the KYC banner AND
 *    unlocks the "Request Withdrawal" button (the primary payout gate).
 */
export default function Payouts({ onNotify }: PayoutsProps) {
  const { totalIncome, platformFee, pendingClearance, withdrawnFunds } = PAYOUT_FINANCE
  const availableUsd = totalIncome - (platformFee + pendingClearance + withdrawnFunds)

  const [currency, setCurrency] = useState<Currency>('USD')
  const [bank, setBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [bankSaved, setBankSaved] = useState(false)

  // NUBAN auto-verification once the account number reaches exactly 10 digits.
  useEffect(() => {
    if (accountNumber.length === 10) {
      setVerifying(true)
      setVerified(false)
      const t = setTimeout(() => {
        setVerifying(false)
        setVerified(true)
        setAccountName('Spaces Partner Ltd')
      }, 1300)
      return () => clearTimeout(t)
    }
    setVerifying(false)
    setVerified(false)
    setAccountName('')
  }, [accountNumber])

  // Format a base-USD figure into the active currency.
  const fmt = (usd: number) =>
    currency === 'NGN'
      ? '₦' + Math.round(usd * NGN_RATE).toLocaleString('en-US')
      : '$' + usd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  const canSaveBank = bank !== '' && verified
  const canWithdraw = bankSaved && availableUsd >= MIN_WITHDRAWAL_USD

  const handleSaveBank = () => {
    if (!canSaveBank) return
    setBankSaved(true)
    onNotify('Payout details saved', 'Bank verified — withdrawals are now unlocked')
  }
  const handleWithdraw = () => {
    if (!canWithdraw) return
    onNotify('Withdrawal requested', `${fmt(availableUsd)} is being processed to your bank`)
  }

  const widgets = [
    { id: 'total', label: 'Total Earnings', usd: totalIncome, icon: TrendingUp, tone: 'default' as const },
    { id: 'available', label: 'Available Balance', usd: availableUsd, icon: Wallet, tone: 'success' as const },
    { id: 'pending', label: 'Pending Clearance', usd: pendingClearance, icon: Clock, tone: 'default' as const },
  ]

  return (
    <section data-testid="payouts-panel">
      {/* KYC / bank verification warning banner */}
      {!bankSaved && (
        <div
          className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 sm:px-5"
          data-testid="kyc-warning-banner"
        >
          <span className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-lg bg-amber-100 text-amber-600">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-amber-900">Withdrawals are locked</p>
            <p className="text-sm text-amber-800">
              Please complete your bank details and submit your Corporate Tax ID to activate payouts.
            </p>
          </div>
        </div>
      )}

      {/* Header + currency toggle */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Payouts</h2>
          <p className="mt-1 text-sm text-slate-500">Dual-currency earnings, bank details and withdrawals</p>
        </div>

        <div className="inline-flex items-center rounded-full border border-line bg-white p-1" data-testid="payout-currency-toggle">
          {(['USD', 'NGN'] as Currency[]).map((c) => {
            const active = currency === c
            return (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-200',
                  active ? 'bg-brand-600 text-white shadow-[0_8px_18px_-10px_rgba(15,118,110,0.9)]' : 'text-slate-600 hover:text-ink',
                )}
                data-testid={`payout-currency-${c.toLowerCase()}`}
              >
                View in {c} ({c === 'USD' ? '$' : '₦'})
              </button>
            )
          })}
        </div>
      </div>

      {/* Financial widgets */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
        {widgets.map((w) => {
          const success = w.tone === 'success'
          const Icon = w.icon
          return (
            <div
              key={w.id}
              className={cn('rounded-2xl border p-5 shadow-card sm:p-6', success ? 'border-emerald-200 bg-emerald-50/60' : 'border-line bg-white')}
              data-testid={`payout-widget-${w.id}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{w.label}</span>
                <span className={cn('grid h-9 w-9 place-items-center rounded-lg', success ? 'bg-emerald-600 text-white' : 'bg-brand-600/10 text-brand-600')}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-ink" data-testid={`payout-value-${w.id}`}>
                {fmt(w.usd)}
              </p>
              {w.id === 'total' ? (
                <p className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500" data-testid="platform-fee-caption">
                  <Info className="mt-px h-3.5 w-3.5 flex-none text-slate-400" />
                  Platform fee calculated at a flat 10% rate per completed booking.
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  {w.id === 'available' ? 'Ready to withdraw' : 'Clearing in 1–3 days'}
                </p>
              )}
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
              <p className="text-xs text-slate-500">Nigerian bank account for your payouts</p>
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
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit NUBAN"
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] tracking-wide text-ink placeholder:text-slate-400 focus-ring"
                  data-testid="account-number-input"
                />
              </div>
              <div>
                <label htmlFor="account-name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Account Name
                </label>
                <input
                  id="account-name"
                  value={verified ? accountName : ''}
                  readOnly
                  placeholder="Auto-filled after verification"
                  className="w-full rounded-xl border border-line bg-slate-50 px-4 py-3 text-[15px] text-slate-500 placeholder:text-slate-400"
                  data-testid="account-name-input"
                />
              </div>
            </div>

            {/* NUBAN verification states */}
            {verifying && (
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-600" data-testid="nuban-verifying">
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying NUBAN…
              </div>
            )}
            {verified && (
              <div
                className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-600/20"
                data-testid="nuban-verified-name"
              >
                <BadgeCheck className="h-[18px] w-[18px]" />
                Account Name: Spaces Partner Ltd <span className="text-brand-600">(Verified)</span>
              </div>
            )}

            <button
              onClick={handleSaveBank}
              disabled={!canSaveBank}
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.8)] transition-all duration-200 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
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
            {fmt(availableUsd)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Minimum withdrawal is {fmt(MIN_WITHDRAWAL_USD)}</p>

          <div className="mt-auto pt-6">
            <button
              onClick={handleWithdraw}
              disabled={!canWithdraw}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(15,118,110,0.9)] transition-all duration-200 hover:bg-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-400/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400 disabled:shadow-none"
              data-testid="request-withdrawal-button"
            >
              <ArrowUpRight className="h-5 w-5" /> Request Withdrawal
            </button>
            {!bankSaved && (
              <p className="mt-2 text-center text-xs text-amber-300" data-testid="withdrawal-locked-note">
                Complete &amp; save your bank details to unlock withdrawals.
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
                <div className="text-sm font-bold text-ink">{fmt(p.amount)}</div>
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
