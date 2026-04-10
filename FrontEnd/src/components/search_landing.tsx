import { forwardRef } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export const SearchBar = forwardRef<
  HTMLInputElement,
  {
    className?: string
    placeholder?: string
    value?: string
    onChange?: (v: string) => void
    onBlur?: () => void
    autoFocus?: boolean
  }
>(
  (
    {
      className,
      placeholder = 'Buscar produtos...',
      value,
      onChange,
      onBlur,
      autoFocus,
    },
    ref
  ) => {
    return (
      <div className={cn('relative', className)}>
        <Search
          size={15}
          className='absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'
        />
        <input
          ref={ref}
          type='text'
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          autoFocus={autoFocus}
          className='h-9 w-full min-w-[140px] rounded-full border border-input bg-muted/25 pr-4 pl-9 text-sm text-muted-foreground transition-all outline-none focus:ring-2 focus:ring-ring'
        />
      </div>
    )
  }
)

SearchBar.displayName = 'SearchBar'
