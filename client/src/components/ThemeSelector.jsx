import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { Sun, Moon, Palette } from 'lucide-react'

export default function ThemeSelector() {
  const { theme, setTheme } = useContext(ThemeContext)

  const themes = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
      description: 'Clean bright theme'
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes'
    },
    {
      value: 'k-acc-rakho',
      label: 'K Acc Rakho',
      icon: Palette,
      description: 'Premium warm theme'
    }
  ]

  const currentTheme = themes.find(t => t.value === theme)

  return (
    <div className="relative group">
      <button
        onClick={() => {
          const currentIndex = themes.findIndex(t => t.value === theme)
          const nextIndex = (currentIndex + 1) % themes.length
          setTheme(themes[nextIndex].value)
        }}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200/60 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        title="Switch theme"
      >
        {currentTheme?.icon && (
          <currentTheme.icon className="h-4 w-4" />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentTheme?.label}
        </span>
      </button>

      {/* Theme Dropdown */}
      <div className="absolute top-full right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-xl p-2">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${theme === themeOption.value
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              <themeOption.icon className="h-4 w-4 shrink-0" />
              <div className="text-left flex-1">
                <div className="text-sm font-medium">{themeOption.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{themeOption.description}</div>
              </div>
              {theme === themeOption.value && (
                <div className="h-2 w-2 bg-blue-500 rounded-full shrink-0"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
