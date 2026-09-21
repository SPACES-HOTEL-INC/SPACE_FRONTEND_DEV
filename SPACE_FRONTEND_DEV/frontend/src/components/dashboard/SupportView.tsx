import React, { useState } from 'react'
import {
  LifeBuoy,
  Mail,
  PhoneCall,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
} from 'lucide-react'

interface Ticket {
  id: string
  subject: string
  date: string
  status: 'Open' | 'In Progress' | 'Resolved'
}

export default function SupportView() {
  const [submitted, setSubmitted] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Demo Ticket History
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'TKT-1082', subject: 'Payout delay for May 28', date: 'May 29, 2026', status: 'Resolved' },
    { id: 'TKT-1049', subject: 'Updating room pricing currency', date: 'Apr 12, 2026', status: 'Resolved' },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !message) return

    const newTicket: Ticket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: subject,
      date: 'Just now',
      status: 'Open',
    }

    setTickets([newTicket, ...tickets])
    setSubmitted(true)
  }

  const faqs = [
    {
      q: 'How long do payout withdrawals take to process?',
      a: 'Payout requests are typically processed within 24 to 48 business hours once your Corporate Tax ID and Bank Account details are verified.',
    },
    {
      q: 'How do I add or manage receptionist accounts?',
      a: 'Go to the Receptionists tab on your left sidebar menu. Click "Add Staff Account" to issue login credentials for front-desk personnel.',
    },
    {
      q: 'What happens when a guest cancels a booking?',
      a: 'Refund eligibility depends on the Cancellation Policy selected under your Settings > Policies tab. Standard automated adjustments apply to your pending balance.',
    },
    {
      q: 'Can I set different room rates for peak seasons?',
      a: 'Yes, you can edit pricing individually under the Manage Rooms tab by selecting any room and clicking "Edit Rates".',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Support & Help Center</h1>
        <p className="text-sm text-slate-500">
          Get assistance with your Spaces HM platform and property operations.
        </p>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Mail className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Email Support</p>
            <p className="text-sm font-semibold text-ink break-all sm:break-normal">
              support@spaces.ng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <PhoneCall className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Direct Desk</p>
            <p className="text-sm font-semibold text-ink">+234 800 772 237</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Support Ticket Form (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-ink">
            <LifeBuoy className="h-5 w-5 text-brand-600" /> Submit a Support Ticket
          </h2>

          {submitted ? (
            <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                <p className="text-sm font-semibold">Ticket Received!</p>
              </div>
              <p className="text-xs text-emerald-700">
                Our team has logged your issue and added it to your ticket history below. We will inspect it and contact you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setSubject('')
                  setMessage('')
                }}
                className="mt-2 text-left text-xs font-semibold text-emerald-900 underline underline-offset-2"
              >
                Submit another ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Issue updating room pricing"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe what happened or what you need help with..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                <Send className="h-4 w-4" /> Submit Ticket
              </button>
            </form>
          )}
        </div>

        {/* Ticket History Sidebar (1 Col) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            <Clock className="h-5 w-5 text-brand-600" /> Ticket History
          </h2>
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-slate-500">{t.id}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      t.status === 'Open'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="font-medium text-ink truncate">{t.subject}</p>
                <p className="text-slate-400">{t.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
          <HelpCircle className="h-5 w-5 text-brand-600" /> Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, index) => (
            <div key={index} className="py-3">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between text-left text-sm font-medium text-ink hover:text-brand-600 transition"
              >
                <span>{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                )}
              </button>
              {openFaq === index && (
                <p className="mt-2 text-xs text-slate-500 leading-relaxed pl-1">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}