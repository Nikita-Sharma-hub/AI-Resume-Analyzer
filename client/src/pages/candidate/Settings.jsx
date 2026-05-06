import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function Settings() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    notifications: {
      email: true,
      push: false,
      jobAlerts: true,
      applicationUpdates: true
    },
    privacy: {
      profileVisibility: 'public',
      showResume: true,
      allowContact: true
    }
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || ''
      }))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      // TODO: Add API call to update settings
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage('Settings updated successfully!')
    } catch (error) {
      setMessage('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const currentPassword = formData.get('currentPassword')
    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // TODO: Add API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage('Password changed successfully!')
      e.target.reset()
    } catch (error) {
      setMessage('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // TODO: Add API call to delete account
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      logout()
    } catch (error) {
      setMessage('Failed to delete account')
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Settings
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" loading={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Notification Preferences
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</div>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: !prev.notifications.email }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notifications.email ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Receive browser notifications</div>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: !prev.notifications.push }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notifications.push ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Job Alerts</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Get notified about new matching jobs</div>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, jobAlerts: !prev.notifications.jobAlerts }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notifications.jobAlerts ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notifications.jobAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Application Updates</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Get notified about application status changes</div>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, applicationUpdates: !prev.notifications.applicationUpdates }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notifications.applicationUpdates ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notifications.applicationUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSubmit} loading={loading}>
                  Save Preferences
                </Button>
              </div>
            </Card>
          )}

          {/* Privacy */}
          {activeTab === 'privacy' && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Privacy Settings
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Visibility
                  </label>
                  <select
                    value={formData.privacy.profileVisibility}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, profileVisibility: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="public">Public</option>
                    <option value="recruiters">Recruiters Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Show Resume in Profile</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Allow recruiters to view your resume</div>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showResume: !prev.privacy.showResume }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.privacy.showResume ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.privacy.showResume ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Allow Contact</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Let recruiters contact you directly</div>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, allowContact: !prev.privacy.allowContact }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.privacy.allowContact ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.privacy.allowContact ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSubmit} loading={loading}>
                  Save Privacy Settings
                </Button>
              </div>
            </Card>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Change Password
                </div>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      required
                      minLength={8}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      minLength={8}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" loading={loading}>
                      Change Password
                    </Button>
                  </div>
                </form>
              </Card>

              <Card>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Account Activity
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Account Created</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
                    <Badge tone="success">Active</Badge>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Danger Zone */}
          {activeTab === 'danger' && (
            <Card className="border-red-200 dark:border-red-800">
              <div className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                Danger Zone
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                    Delete Account
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    loading={loading}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Message Display */}
          {message && (
            <div className={`rounded-lg p-4 ${
              message.includes('success') 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
