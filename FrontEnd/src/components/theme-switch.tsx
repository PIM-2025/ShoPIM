import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/theme-provider'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  useEffect(() => {
    const themeColor = theme === 'dark' ? '#52525b' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  }, [theme])

  const toggle = () => setTheme(isDark ? 'light' : 'dark')

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative flex items-center w-14 h-7 rounded-full p-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-zinc-200 dark:bg-zinc-700"
    >
      {/* Track icons */}
      <Sun className="absolute left-1.5 size-3.5 text-zinc-500 dark:text-zinc-400" />
      <Moon className="absolute right-1.5 size-3.5 text-zinc-500 dark:text-zinc-400" />

      {/* Thumb */}
      <span
        className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full shadow-sm transition-transform duration-300 bg-white dark:bg-zinc-900
          ${isDark ? 'translate-x-7' : 'translate-x-0'}`}
      >
        {isDark
          ? <Moon className="size-3 text-zinc-200" />
          : <Sun className="size-3 text-yellow-500" />
        }
      </span>
    </button>
  )
}