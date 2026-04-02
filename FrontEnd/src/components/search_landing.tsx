import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchBar({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <Search
        size={15}
        className='absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'
      />
      <input
        type='text'
        placeholder='Buscar produtos...'
        className='h-9 w-full min-w-[140px] rounded-full border border-input bg-muted/25 pr-4 pl-9 text-sm text-muted-foreground transition-all outline-none focus:ring-2 focus:ring-ring'
      />
    </div>
  )
}
