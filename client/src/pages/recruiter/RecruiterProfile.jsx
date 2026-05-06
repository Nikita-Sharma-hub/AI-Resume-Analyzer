import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function RecruiterProfile() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    location: '',
    bio: '',
    website: '',
    linkedin: '',
    industry: '',
    companySize: '',
    foundedYear: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        position: user.position || '',
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        industry: user.industry || '',
        companySize: user.companySize || '',
        foundedYear: user.foundedYear || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Add API call to update profile
      await updateUser(formData)
      setEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Profile</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your professional information and company details
          </p>
        </div>
        <Button
          onClick={() => setEditing(!editing)}
          variant={editing ? "secondary" : "primary"}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </div>

            {editing ? (
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
                      className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tell us about yourself and your recruiting experience..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" loading={loading}>
                    Save Changes
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.name || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.phone || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Position</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.position || 'Not provided'}</div>
                  </div>
                </div>
                {formData.bio && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.bio}</div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Company Information */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Company Information
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Size
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      value={formData.foundedYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., 2010"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Name</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.company || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.industry || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Size</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.companySize || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Founded</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.foundedYear || 'Not provided'}</div>
                  </div>
                </div>

                {formData.location && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Location</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.location}</div>
                  </div>
                )}

                {formData.website && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Website</div>
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-indigo-600 hover:text-indigo-500 text-sm break-all"
                    >
                      {formData.website}
                    </a>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {/* Social Links */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Social Links
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://linkedin.com/in/companyname"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.linkedin && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">LinkedIn</div>
                    <a
                      href={formData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-indigo-600 hover:text-indigo-500 text-sm break-all"
                    >
                      {formData.linkedin}
                    </a>
                  </div>
                )}

                {!formData.linkedin && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    No social links added
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Account Statistics */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Statistics
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profile Completion</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">80%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Jobs Posted</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Applicants</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">145</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Hired Candidates</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => window.location.href = '/recruiter/post-job'}
              >
                Post New Job
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/recruiter/manage-jobs'}
              >
                Manage Jobs
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/recruiter/settings'}
              >
                Account Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
