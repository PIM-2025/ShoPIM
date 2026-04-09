// components/password-input.tsx
import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPassword?: boolean
  onTogglePassword?: () => void
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showPassword: showProp, onTogglePassword, ...props }, ref) => {
    const [showInternal, setShowInternal] = useState(false)

    const isControlled = showProp !== undefined
    const show = isControlled ? showProp : showInternal
    const toggle = isControlled
      ? onTogglePassword
      : () => setShowInternal((v) => !v)

    return (
      <div className='relative'>
        <Input
          type={show ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
        />
        <button
          type='button'
          onClick={toggle}
          className='absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground'
          tabIndex={-1}
        >
          {show ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'
