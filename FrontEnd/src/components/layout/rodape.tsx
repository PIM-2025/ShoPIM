import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'

export function Rodape() {
  const [email, setEmail] = useState('')

  function handleNewsletter() {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Digite um e-mail válido.')
      return
    }
    toast.success('Inscrição realizada! Fique de olho nas novidades.')
    setEmail('')
  }

  return (
    <footer className='w-full border-t border-border bg-background px-8 pt-12 pb-6 text-foreground'>
      <div className='mx-auto grid max-w-6xl grid-cols-2 gap-10 border-b border-border pb-10 md:grid-cols-4'>
        {/* MARCA + NEWSLETTER */}
        <div className='col-span-2 md:col-span-1'>
          <h2 className='mb-2 font-serif text-2xl font-semibold tracking-tight text-foreground'>
            ShoPIM
          </h2>
          <p className='mb-4 max-w-xs text-sm leading-relaxed text-muted-foreground'>
            A ShoPIM é uma plataforma de e-commerce desenvolvida como projeto
            acadêmico.
          </p>
          <p className='mb-2 text-xs tracking-widest text-muted-foreground uppercase'>
            Novidades exclusivas
          </p>
          <div className='flex overflow-hidden rounded-md border border-border'>
            <input
              type='email'
              placeholder='seu@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNewsletter()}
              className='min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground'
            />
            <button
              onClick={handleNewsletter}
              className='shrink-0 bg-orange-600 px-4 py-2 text-xs font-medium whitespace-nowrap text-white transition-colors hover:bg-orange-700'
            >
              Inscrever
            </button>
          </div>
        </div>

        {/* CATEGORIAS */}
        <div>
          <h3 className='mb-4 text-xs tracking-widest text-muted-foreground uppercase'>
            Categorias
          </h3>
          <ul className='space-y-2'>
            <li>
              <Link
                to='/categoria/$slug'
                params={{ slug: 'eletronicos' }}
                className='text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-orange-600 hover:underline'
              >
                Eletrônicos
              </Link>
            </li>
            <li>
              <Link
                to='/categoria/$slug'
                params={{ slug: 'roupas' }}
                className='text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-orange-600 hover:underline'
              >
                Roupas
              </Link>
            </li>
            <li>
              <Link
                to='/categoria/$slug'
                params={{ slug: 'acessorios' }}
                className='text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-orange-600 hover:underline'
              >
                Acessórios
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPORTE */}
        <div>
          <h3 className='mb-4 text-xs tracking-widest text-muted-foreground uppercase'>
            Suporte
          </h3>
          <ul className='space-y-2'>
            <li>
              <span className='cursor-default text-sm text-muted-foreground'>
                Central de ajuda
              </span>
            </li>
            <li>
              <span className='cursor-default text-sm text-muted-foreground'>
                Trocas e devoluções
              </span>
            </li>
            <li>
              <span className='cursor-default text-sm text-muted-foreground'>
                Rastrear pedido
              </span>
            </li>
            <li>
              <span className='cursor-default text-sm text-muted-foreground'>
                Fale conosco
              </span>
            </li>
          </ul>
        </div>

        {/* EMPRESA */}
        <div>
          <h3 className='mb-4 text-xs tracking-widest text-muted-foreground uppercase'>
            Empresa
          </h3>
          <ul className='space-y-2'>
            <li>
              <span className='cursor-default text-sm text-muted-foreground'>
                Sobre nós
              </span>
            </li>
            <li>
              <Link
                to='/sign-in'
                className='text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-orange-600 hover:underline'
              >
                Entrar na conta
              </Link>
            </li>
            <li>
              <Link
                to='/sign-up'
                className='text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-orange-600 hover:underline'
              >
                Criar conta
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* RODAPÉ INFERIOR */}
      <div className='mx-auto mt-6 flex max-w-6xl flex-col flex-wrap items-start gap-4 md:flex-row md:items-center md:justify-between'>
        <span className='text-xs text-muted-foreground'>
          © 2026 SHOPIM. Todos os direitos reservados.
        </span>

        <div className='flex flex-wrap gap-2'>
          <span className='rounded border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground'>
            Pix
          </span>
          <span className='rounded border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground'>
            Cartão
          </span>
          <span className='rounded border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground'>
            Boleto
          </span>
        </div>

        <a
          href='https://github.com/PIM-2025/ShoPIM'
          target='_blank'
          rel='noopener noreferrer'
          className='flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-all hover:border-orange-600 hover:bg-orange-600 hover:text-white'
        >
          <svg
            viewBox='0 0 24 24'
            className='h-4 w-4'
            fill='currentColor'
            aria-hidden='true'
          >
            <path d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z' />
          </svg>
        </a>
      </div>

      {/* BENEFÍCIOS */}
      <div className='mx-auto mt-6 flex max-w-6xl flex-wrap gap-6 border-t border-border pt-6'>
        {[
          'Frete grátis',
          'Troca em até 30 dias',
          'Pagamento 100% seguro',
          'Atendimento via WhatsApp',
        ].map((b) => (
          <div
            key={b}
            className='flex items-center gap-2 text-xs text-muted-foreground'
          >
            <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-orange-600' />
            {b}
          </div>
        ))}
      </div>
    </footer>
  )
}
