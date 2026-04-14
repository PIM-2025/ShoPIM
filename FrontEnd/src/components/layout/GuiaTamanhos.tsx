import { Ruler } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

/* ── Detecta o tipo de peça pelo nome do produto ─────────────────── */
function detectarTipo(nome: string): 'calcado' | 'inferior' | 'superior' {
  const n = nome.toLowerCase()
  if (/t[êe]nis|chinelo|sapato|sandalia|bota/.test(n)) return 'calcado'
  if (/cal[çc]a|jeans|short|bermuda|saia/.test(n)) return 'inferior'
  return 'superior'
}

/* ── Tabelas ─────────────────────────────────────────────────────── */
function TabelaSuperior() {
  const rows = [
    { tam: 'PP', busto: '82–86', cintura: '64–68', ombro: '37' },
    { tam: 'P',  busto: '87–91', cintura: '69–73', ombro: '39' },
    { tam: 'M',  busto: '92–96', cintura: '74–78', ombro: '41' },
    { tam: 'G',  busto: '97–102', cintura: '79–84', ombro: '43' },
    { tam: 'GG', busto: '103–108', cintura: '85–90', ombro: '45' },
    { tam: 'XGG', busto: '109–115', cintura: '91–97', ombro: '47' },
  ]
  return (
    <>
      <p className='mb-3 text-xs text-muted-foreground'>Medidas em centímetros (cm)</p>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-border text-left text-xs font-semibold uppercase text-muted-foreground'>
            <th className='pb-2 pr-4'>Tamanho</th>
            <th className='pb-2 pr-4'>Busto</th>
            <th className='pb-2 pr-4'>Cintura</th>
            <th className='pb-2'>Ombro</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.tam} className='border-b border-border/50 last:border-0'>
              <td className='py-2 pr-4 font-semibold'>{r.tam}</td>
              <td className='py-2 pr-4'>{r.busto}</td>
              <td className='py-2 pr-4'>{r.cintura}</td>
              <td className='py-2'>{r.ombro}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function TabelaInferior() {
  const rows = [
    { tam: '36', cintura: '68', quadril: '88', comp: '97' },
    { tam: '38', cintura: '70', quadril: '90', comp: '98' },
    { tam: '40', cintura: '72', quadril: '92', comp: '99' },
    { tam: '42', cintura: '76', quadril: '96', comp: '100' },
    { tam: '44', cintura: '80', quadril: '100', comp: '101' },
    { tam: '46', cintura: '84', quadril: '104', comp: '102' },
    { tam: '48', cintura: '88', quadril: '108', comp: '103' },
  ]
  return (
    <>
      <p className='mb-3 text-xs text-muted-foreground'>Medidas em centímetros (cm)</p>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-border text-left text-xs font-semibold uppercase text-muted-foreground'>
            <th className='pb-2 pr-4'>Tamanho</th>
            <th className='pb-2 pr-4'>Cintura</th>
            <th className='pb-2 pr-4'>Quadril</th>
            <th className='pb-2'>Comprimento</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.tam} className='border-b border-border/50 last:border-0'>
              <td className='py-2 pr-4 font-semibold'>{r.tam}</td>
              <td className='py-2 pr-4'>{r.cintura}</td>
              <td className='py-2 pr-4'>{r.quadril}</td>
              <td className='py-2'>{r.comp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function TabelaCalcado() {
  const rows = [
    { br: '34', eu: '34', us: '4',   cm: '22,0' },
    { br: '35', eu: '35', us: '4,5', cm: '22,5' },
    { br: '36', eu: '36', us: '5,5', cm: '23,0' },
    { br: '37', eu: '37', us: '6',   cm: '23,5' },
    { br: '38', eu: '38', us: '7',   cm: '24,5' },
    { br: '39', eu: '39', us: '7,5', cm: '25,0' },
    { br: '40', eu: '40', us: '8',   cm: '25,5' },
    { br: '41', eu: '41', us: '9',   cm: '26,0' },
    { br: '42', eu: '42', us: '9,5', cm: '26,5' },
    { br: '43', eu: '43', us: '10',  cm: '27,5' },
    { br: '44', eu: '44', us: '10,5', cm: '28,0' },
  ]
  return (
    <>
      <p className='mb-3 text-xs text-muted-foreground'>
        Meça seu pé do calcanhar à ponta do dedo maior com uma régua.
      </p>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-border text-left text-xs font-semibold uppercase text-muted-foreground'>
            <th className='pb-2 pr-4'>BR</th>
            <th className='pb-2 pr-4'>EU</th>
            <th className='pb-2 pr-4'>US</th>
            <th className='pb-2'>Comprimento (cm)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.br} className='border-b border-border/50 last:border-0'>
              <td className='py-2 pr-4 font-semibold'>{r.br}</td>
              <td className='py-2 pr-4'>{r.eu}</td>
              <td className='py-2 pr-4'>{r.us}</td>
              <td className='py-2'>{r.cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

/* ── Dica de como medir ──────────────────────────────────────────── */
function DicaMedicao({ tipo }: { tipo: 'calcado' | 'inferior' | 'superior' }) {
  const dicas =
    tipo === 'calcado'
      ? ['Meça com meias', 'Se seu pé estiver entre dois tamanhos, escolha o maior', 'Meça no final do dia — o pé costuma inchar levemente']
      : tipo === 'inferior'
      ? ['Meça a cintura na parte mais estreita do tronco', 'Meça o quadril na parte mais larga', 'Use uma fita métrica bem justa, sem apertar']
      : ['Meça o busto na parte mais larga do peito', 'Meça a cintura na parte mais estreita', 'Mantenha os braços relaxados ao medir o ombro']

  return (
    <div className='mt-4 rounded-lg bg-muted/40 p-3'>
      <p className='mb-2 text-xs font-semibold uppercase text-muted-foreground'>Como medir</p>
      <ul className='space-y-1'>
        {dicas.map((d, i) => (
          <li key={i} className='flex items-start gap-2 text-xs text-muted-foreground'>
            <span className='mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
            {d}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Componente principal ────────────────────────────────────────── */
export function GuiaTamanhos({ nomeProduto }: { nomeProduto: string }) {
  const tipo = detectarTipo(nomeProduto)

  const titulo =
    tipo === 'calcado' ? 'Guia de numeração' :
    tipo === 'inferior' ? 'Guia de tamanhos — inferior' :
    'Guia de tamanhos — superior'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='flex items-center gap-1.5 text-xs text-primary underline-offset-2 hover:underline'>
          <Ruler size={13} />
          Guia de tamanhos
        </button>
      </DialogTrigger>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Ruler size={16} />
            {titulo}
          </DialogTitle>
        </DialogHeader>
        {tipo === 'calcado'  && <TabelaCalcado />}
        {tipo === 'inferior' && <TabelaInferior />}
        {tipo === 'superior' && <TabelaSuperior />}
        <DicaMedicao tipo={tipo} />
      </DialogContent>
    </Dialog>
  )
}
