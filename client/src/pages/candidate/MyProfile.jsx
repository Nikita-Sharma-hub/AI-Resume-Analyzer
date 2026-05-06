import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function MyProfile() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    experience: '',
    education: '',
    linkedin: '',
    github: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experience: user.experience || '',
        education: user.education || '',
        linkedin: user.linkedin || '',
        github: user.github || ''
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

  const handleSkillAdd = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
    }
  }

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Manage your personal information and professional details
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
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
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
                    placeholder="Tell us about yourself..."
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
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</div>
                    <div className="mt-1 text-gray-900 dark:text-white">{formData.location || 'Not provided'}</div>
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

          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Professional Details
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your work experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Education
                  </label>
                  <textarea
                    value={formData.education}
                    onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                    rows={2}
                    className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your educational background..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skills
                  </label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} tone="neutral" onRemove={() => handleSkillRemove(skill)}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a skill and press Enter"
                      className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSkillAdd(e.target.value)
                          e.target.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.experience && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</div>
                    <div className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">{formData.experience}</div>
                  </div>
                )}

                {formData.education && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Education</div>
                    <div className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">{formData.education}</div>
                  </div>
                )}

                {formData.skills.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} tone="neutral">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
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
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                    className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://github.com/username"
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

                {formData.github && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">GitHub</div>
                    <a
                      href={formData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-indigo-600 hover:text-indigo-500 text-sm break-all"
                    >
                      {formData.github}
                    </a>
                  </div>
                )}

                {!formData.linkedin && !formData.github && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    No social links added
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Statistics
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profile Completion</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">75%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Resume Uploads</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Job Applications</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
