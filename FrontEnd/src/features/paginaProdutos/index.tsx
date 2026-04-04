import { ProdutoDetalhe } from "@/components/layout/produtos_detalhe"
import { HeaderLanding } from '@/components/layout/header_landingpage'

export default function App() {
  return(
    <div>
      <div>
        <HeaderLanding />
      </div>
      <div>
        <ProdutoDetalhe />
      </div>
    </div>
  )
}