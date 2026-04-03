import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-provider'

interface ThemeSwitchProps {
  className?: string
}

export function ThemeSwitch({ className }: ThemeSwitchProps) {
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
      aria-label='Toggle theme'
      className={cn(
        'relative flex h-7 w-14 items-center rounded-full bg-zinc-200 p-1 transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:bg-zinc-700',
        className
      )}
    >
      {/* Track icons */}
      <Sun className='absolute left-1.5 size-3.5 text-zinc-500 dark:text-zinc-400' />
      <Moon className='absolute right-1.5 size-3.5 text-zinc-500 dark:text-zinc-400' />

      {/* Thumb */}
      <span
        className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 dark:bg-zinc-900 ${isDark ? 'translate-x-7' : 'translate-x-0'}`}
      >
        {isDark ? (
          <Moon className='size-3 text-zinc-200' />
        ) : (
          <Sun className='size-3 text-yellow-500' />
        )}
      </span>
    </button>
  )
}
