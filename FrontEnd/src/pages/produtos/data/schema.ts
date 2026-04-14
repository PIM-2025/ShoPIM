import { z } from 'zod'

export const produtoSchema = z.object({
  id: z.number(),
  descricao: z.string(),
  preco: z.coerce.number(),
  categoria: z.string(),
  quantidade: z.coerce.number(),
  imagem: z.string().optional().default(''),
  descricaoDetalhada: z.string().optional(),
  imagens: z.string().optional().default(''),
})

export type Produto = z.infer<typeof produtoSchema>
