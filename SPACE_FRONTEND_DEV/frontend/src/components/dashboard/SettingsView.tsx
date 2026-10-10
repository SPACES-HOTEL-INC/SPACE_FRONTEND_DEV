import React, { useState, useEffect } from 'react'
import {
  Bell,
  Lock,
  FileText,
  Save,
  CheckCircle2,
  KeyRound,
  Clock,
  Loader2,
  AlertCircle,
  User,
  Eye,
  EyeOff,
  Building2,
  Trash2,
} from 'lucide-react'
import { fetchWithAuth } from '../../lib/api'

interface SettingsViewProps {
  initialFullName?: string
  onProfileNameSaved?: (fullName: string) => void
}

interface PropertyOption {
  id: string
  name: string
  propertyType: string
}

export default function SettingsView({ initialFullName = '', onProfileNameSaved }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'policies' | 'property-management'>('profile')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [properties, setProperties] = useState<PropertyOption[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [isLoadingProperties, setIsLoadingProperties] = useState(false)
  const [isDeletingProperty, setIsDeletingProperty] = useState(false)
  const [propertyManagementError, setPropertyManagementError] = useState<string | null>(null)
  const [propertyManagementSuccess, setPropertyManagementSuccess] = useState<string | null>(null)
  const [confirmPropertyDeletion, setConfirmPropertyDeletion] = useState(false)

  // Profile State
  const [fullName, setFullName] = useState(initialFullName)
  const [userPhone, setUserPhone] = useState('')

  // Notification Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [bookingConfirmations, setBookingConfirmations] = useState(true)
  const [payoutAlerts, setPayoutAlerts] = useState(true)
  const [theme, setTheme] = useState('Dark')

  // Security State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Check-In & Policies State
  const [checkInTime, setCheckInTime] = useState('14:00')
  const [checkOutTime, setCheckOutTime] = useState('11:00')
  const [cancellationPolicy, setCancellationPolicy] = useState('flexible')

  // Helper to safely unpack response data regardless of whether fetchWithAuth returns a Response or raw Object
  const safeUnpack = async (res: any) => {
    if (!res) return null;
    if (typeof res.json === 'function') {
      try {
        return await res.json();
      } catch (_) {
        return null;
      }
    }
    return res;
  };

  // Fetch initial settings from backend endpoints
  useEffect(() => {
    async function loadAllSettings() {
      try {
        setLoading(true)
        setErrorMessage(null)

        const [profileRes, prefRes] = await Promise.all([
          fetchWithAuth('/api/v1/settings/profile').catch(() => null),
          fetchWithAuth('/api/v1/settings/preferences').catch(() => null),
        ])

        const profileData = await safeUnpack(profileRes)
        if (profileData) {
          const profileFullName = profileData.full_name || profileData.fullName || profileData.fullname
          setFullName(profileFullName || initialFullName)
          setUserPhone(profileData.phone || '')
        }

        const prefData = await safeUnpack(prefRes)
        if (prefData) {
          setEmailNotifications(prefData.emailNotifications ?? prefData.email_notifications ?? true)
          setSmsAlerts(prefData.smsAlerts ?? prefData.sms_alerts ?? false)
          setBookingConfirmations(prefData.bookingConfirmations ?? prefData.booking_confirmations ?? true)
          setPayoutAlerts(prefData.payoutAlerts ?? prefData.payout_alerts ?? true)
          setTheme(prefData.theme || 'Dark')
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    loadAllSettings()
  }, [])

  useEffect(() => {
    if (initialFullName) {
      setFullName((currentName) => currentName || initialFullName)
    }
  }, [initialFullName])

  useEffect(() => {
    if (activeTab !== 'property-management') return

    let isMounted = true

    const loadProperties = async () => {
      setIsLoadingProperties(true)
      setPropertyManagementError(null)
      setPropertyManagementSuccess(null)

      try {
        const data = await fetchWithAuth('/api/v1/properties/mine')
        const items = Array.isArray(data) ? data : data.properties || data.items || data.data || []
        const nextProperties: PropertyOption[] = items.map((property: any) => ({
          id: String(property.id ?? property._id ?? ''),
          name: property.hotel_name || property.name || property.title || 'Untitled property',
          propertyType: String(property.property_type || 'Property'),
        })).filter((property: PropertyOption) => property.id)

        if (!isMounted) return
        setProperties(nextProperties)
        setSelectedPropertyId((currentId) =>
          nextProperties.some((property) => property.id === currentId)
            ? currentId
            : nextProperties[0]?.id || ''
        )
      } catch (error: any) {
        if (isMounted) setPropertyManagementError(error.message || 'Could not load your properties.')
      } finally {
        if (isMounted) setIsLoadingProperties(false)
      }
    }

    loadProperties()
    return () => {
      isMounted = false
    }
  }, [activeTab])

  const handleDeleteProperty = async () => {
    const propertyToDelete = properties.find((property) => property.id === selectedPropertyId)
    if (!propertyToDelete) return

    setIsDeletingProperty(true)
    setPropertyManagementError(null)
    setPropertyManagementSuccess(null)

    try {
      await fetchWithAuth(`/api/v1/properties/${encodeURIComponent(propertyToDelete.id)}`, {
        method: 'DELETE',
      })

      const remainingProperties = properties.filter((property) => property.id !== propertyToDelete.id)
      setProperties(remainingProperties)
      setSelectedPropertyId(remainingProperties[0]?.id || '')
      setConfirmPropertyDeletion(false)
      setPropertyManagementSuccess(`${propertyToDelete.name} was deleted.`)
    } catch (error: any) {
      setPropertyManagementError(error.message || 'Could not delete this property.')
    } finally {
      setIsDeletingProperty(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 'property-management') return
    setSaving(true)
    setErrorMessage(null)

    try {
      let endpoint = ''
      let payload: any = {}

      if (activeTab === 'profile') {
        endpoint = '/api/v1/settings/profile'
        payload = { 
          fullname: fullName.trim(), 
          phone: userPhone.trim(),
          avatarUrl: "" 
        }
      } else if (activeTab === 'notifications') {
        endpoint = '/api/v1/settings/preferences'
        payload = { 
          emailNotifications, 
          smsAlerts, 
          bookingConfirmations, 
          payoutAlerts, 
          theme 
        }
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
        payload = { 
          currentPassword, 
          newPassword, 
          confirmPassword 
        }
      } else if (activeTab === 'policies') {
        endpoint = '/api/v1/settings/business'
        payload = { 
          propertyName: "Property", 
          businessEmail: "info@property.com", 
          supportPhone: userPhone || "0000000000", 
          address: "Default Address", 
          currency: "USD", 
          timezone: "UTC" 
        }
      }

      const res = await fetchWithAuth(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      // Check HTTP status safely if response object exists
      if (res && typeof res.ok === 'boolean' && !res.ok) {
        const errorData = await safeUnpack(res)
        throw new Error(errorData?.message || errorData?.detail || 'Failed to update settings')
      }

      if (activeTab === 'profile') {
        onProfileNameSaved?.(fullName.trim())
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
        <button
          type="button"
          onClick={() => setActiveTab('property-management')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition ${
            activeTab === 'property-management'
              ? 'border-brand-600 text-brand-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 className="h-4 w-4" /> Manage Listings
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
      {activeTab !== 'property-management' && (
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
                  placeholder="e.g. 07048375587"
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
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 pr-11 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((visible) => !visible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
                      aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 pr-11 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((visible) => !visible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 pr-11 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((visible) => !visible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
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
      )}

      {activeTab === 'property-management' && (
        <section className="max-w-3xl space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-ink">Delete a Property</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a property branch to remove it from your listings.
            </p>
          </div>

          {propertyManagementError && (
            <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              <AlertCircle className="h-5 w-5 text-red-600" />
              {propertyManagementError}
            </div>
          )}

          {propertyManagementSuccess && (
            <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              {propertyManagementSuccess}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label htmlFor="property-to-delete" className="mb-2 block text-sm font-semibold text-ink">
              Property branch
            </label>
            {isLoadingProperties ? (
              <div className="flex items-center gap-2 py-3 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                Loading properties...
              </div>
            ) : properties.length > 0 ? (
              <>
                <select
                  id="property-to-delete"
                  value={selectedPropertyId}
                  disabled={isDeletingProperty || confirmPropertyDeletion}
                  onChange={(event) => {
                    setSelectedPropertyId(event.target.value)
                    setConfirmPropertyDeletion(false)
                    setPropertyManagementError(null)
                    setPropertyManagementSuccess(null)
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-slate-50"
                >
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name} ({property.propertyType})
                    </option>
                  ))}
                </select>

                {!confirmPropertyDeletion ? (
                  <button
                    type="button"
                    disabled={isDeletingProperty}
                    onClick={() => {
                      setPropertyManagementError(null)
                      setPropertyManagementSuccess(null)
                      setConfirmPropertyDeletion(true)
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete selected property
                  </button>
                ) : (
                  <div role="alertdialog" aria-live="assertive" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-900">
                      Delete {properties.find((property) => property.id === selectedPropertyId)?.name}?
                    </p>
                    <p className="mt-1 text-sm text-red-800">This action cannot be undone.</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={isDeletingProperty}
                        onClick={() => setConfirmPropertyDeletion(false)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isDeletingProperty}
                        onClick={handleDeleteProperty}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {isDeletingProperty ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        {isDeletingProperty ? 'Deleting...' : 'Confirm delete'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                No properties are available to delete.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}