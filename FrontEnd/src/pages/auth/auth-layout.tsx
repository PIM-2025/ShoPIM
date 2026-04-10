import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import LogoImg from '@/assets/favicon.png'
import { Button } from '@/components/ui/button'
import { ThemeSwitch } from '@/components/theme-switch'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className='relative container grid h-svh max-w-none items-center justify-center'>
      <div className='absolute top-4 left-4 right-4 flex items-center justify-between'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate({ to: '/' })}
          aria-label='Voltar'
        >
          <ArrowLeft size={18} />
        </Button>
        <ThemeSwitch />
      </div>

      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <img src={LogoImg} alt='ShoPIM Logo' className='me-2 h-8 w-auto' />
          <h1 className='text-xl font-medium'>ShoPIM</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
