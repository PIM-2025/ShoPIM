import { z } from 'zod'

export const clienteSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  cpf: z.string().nullable().optional(),
  dataCadastro: z.union([z.coerce.date(), z.null(), z.undefined()]).transform((v) => v ?? null),
  ativo: z.number(),
  role: z.number(),
})

export type Cliente = z.infer<typeof clienteSchema>
