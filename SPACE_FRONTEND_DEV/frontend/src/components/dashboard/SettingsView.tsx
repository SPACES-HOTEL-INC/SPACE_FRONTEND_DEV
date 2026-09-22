import React, { useState, useEffect } from 'react'
import {
  Building2,
  Bell,
  Lock,
  FileText,
  Save,
  CheckCircle2,
  Shield,
  KeyRound,
  Clock,
  Loader2,
  AlertCircle,
  User,
} from 'lucide-react'
import { fetchWithAuth } from "../../lib/api"

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<'profile' | 'details' | 'notifications' | 'security' | 'policies'>('profile')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Profile State
  const [fullName, setFullName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  // Hotel Business Details State
  const [propertyName, setPropertyName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [supportPhone, setSupportPhone] = useState('')
  const [address, setAddress] = useState('')
  const [currency, setCurrency] = useState('NGN')
  const [timezone, setTimezone] = useState('Africa/Lagos')

  // Notification Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [bookingConfirmations, setBookingConfirmations] = useState(true)
  const [payoutAlerts, setPayoutAlerts] = useState(true)
  const [theme, setTheme] = useState('dark')

  // Security State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Check-In & Policies State
  const [checkInTime, setCheckInTime] = useState('14:00')
  const [checkOutTime, setCheckOutTime] = useState('11:00')
  const [cancellationPolicy, setCancellationPolicy] = useState('flexible')

  // Fetch initial settings from all backend endpoints
  useEffect(() => {
    async function loadAllSettings() {
      try {
        setLoading(true)
        setErrorMessage(null)

        const [profileRes, businessRes, prefRes] = await Promise.all([
          fetchWithAuth('/api/v1/settings/profile').catch(() => null),
          fetchWithAuth('/api/v1/settings/business').catch(() => null),
          fetchWithAuth('/api/v1/settings/preferences').catch(() => null),
        ])

        if (profileRes && profileRes.ok) {
          const profileData = await profileRes.json()
          setFullName(profileData.fullName || profileData.full_name || '')
          setUserPhone(profileData.phone || '')
          setAvatarUrl(profileData.avatarUrl || profileData.avatar_url || '')
        }

        if (businessRes && businessRes.ok) {
          const businessData = await businessRes.json()
          setPropertyName(businessData.propertyName || businessData.property_name || '')
          setBusinessEmail(businessData.businessEmail || businessData.business_email || '')
          setSupportPhone(businessData.supportPhone || businessData.support_phone || '')
          setAddress(businessData.address || '')
          setCurrency(businessData.currency || 'NGN')
          setTimezone(businessData.timezone || 'Africa/Lagos')
        }

        if (prefRes && prefRes.ok) {
          const prefData = await prefRes.json()
          setEmailNotifications(prefData.emailNotifications ?? prefData.email_notifications ?? true)
          setSmsAlerts(prefData.smsAlerts ?? prefData.sms_alerts ?? false)
          setBookingConfirmations(prefData.bookingConfirmations ?? prefData.booking_confirmations ?? true)
          setPayoutAlerts(prefData.payoutAlerts ?? prefData.payout_alerts ?? true)
          setTheme(prefData.theme || 'dark')
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    loadAllSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage(null)

    try {
      let endpoint = ''
      let payload = {}

      if (activeTab === 'profile') {
        endpoint = '/api/v1/settings/profile'
        payload = { fullName, phone: userPhone, avatarUrl }
      } else if (activeTab === 'details') {
        endpoint = '/api/v1/settings/business'
        payload = { propertyName, businessEmail, supportPhone, address, currency, timezone }
      } else if (activeTab === 'notifications') {
        endpoint = '/api/v1/settings/preferences'
        payload = { emailNotifications, smsAlerts, bookingConfirmations, payoutAlerts, theme }
      } else if (activeTab === 'security') {
        if (!currentPassword || !newPassword) {
          setErrorMessage('Please fill in both current and new passwords.')
          setSaving(false)
          return
        }
        if (newPassword !== confirmPassword) {
          setErrorMessage('New passwords do not match.')
          setSaving(false)
          return
        }
        endpoint = '/api/v1/settings/security/password'
        payload = { currentPassword, newPassword, confirmPassword }
      } else if (activeTab === 'policies') {
        // Fallback for custom policy tab if handled under business settings
        endpoint = '/api/v1/settings/business'
        payload = { checkInTime, checkOutTime, cancellationPolicy }
      }

      const res = await fetchWithAuth(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.detail || 'Failed to update settings')
      }

      setSaved(true)
      if (activeTab === 'security') {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-slate-500">
          Manage your account details and platform configurations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 text-sm font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
            activeTab === 'profile'
              ? 'border-brand-600 text-brand-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="h-4 w-4" /> Personal Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
            activeTab === 'details'
              ? 'border-brand-600 text-brand-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 className="h-4 w-4" /> Hotel Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
            activeTab === 'notifications'
              ? 'border-brand-600 text-brand-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Bell className="h-4 w-4" /> Preferences
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
            activeTab === 'security'
              ? 'border-brand-600 text-brand-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Lock className="h-4 w-4" /> Security & Password
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
            activeTab === 'policies'
              ? 'border-brand-600 text-brand-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="h-4 w-4" /> Policies & Check-In
        </button>
      </div>

      {/* Alert Banners */}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Settings updated successfully!
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600" />
          {errorMessage}
        </div>
      )}

      {/* Tab Content Form */}
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        {/* Personal Profile Tab */}
        {activeTab === 'profile' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-ink">Personal Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abubakar Samuel"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Phone Number</label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="e.g. +2348059780405"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Hotel Details Tab */}
        {activeTab === 'details' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-ink">Property & Business Settings</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Property Name</label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="Spaces Hotel & Suites"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Business Email</label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="contact@spaceshm.com"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Support Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  placeholder="+2348059780405"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Currency</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  placeholder="NGN"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Hospitality Way, Abuja, Nigeria"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="Africa/Lagos"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications & Preferences Tab */}
        {activeTab === 'notifications' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-ink">Preferences & Alerts</h2>
            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">Email Notifications</p>
                  <p className="text-xs text-slate-500">Receive general platform updates and summaries via email.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">SMS Alerts</p>
                  <p className="text-xs text-slate-500">Get instant text alerts for urgent guest requests or system errors.</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">Booking Confirmations</p>
                  <p className="text-xs text-slate-500">Receive immediate notifications when new reservations are created.</p>
                </div>
                <input
                  type="checkbox"
                  checked={bookingConfirmations}
                  onChange={(e) => setBookingConfirmations(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">Payout Alerts</p>
                  <p className="text-xs text-slate-500">Get notified when weekly settlements are processed.</p>
                </div>
                <input
                  type="checkbox"
                  checked={payoutAlerts}
                  onChange={(e) => setPayoutAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
                <KeyRound className="h-5 w-5 text-brand-600" /> Change Password
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
              <Clock className="h-5 w-5 text-brand-600" /> Check-In Times & Cancellation Policy
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Standard Check-In Time</label>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Standard Check-Out Time</label>
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">Cancellation Policy</label>
                <select
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                >
                  <option value="flexible">Flexible (Full refund up to 24 hours before check-in)</option>
                  <option value="moderate">Moderate (Full refund up to 5 days before check-in)</option>
                  <option value="strict">Strict (50% refund up to 7 days before check-in)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}