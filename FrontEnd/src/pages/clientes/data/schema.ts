import { z } from 'zod'

const clienteAddressSchema = z.object({
  id: z.number(),
  rua: z.string().nullable().optional(),
  numero: z.string().nullable().optional(),
  cidade: z.string().nullable().optional(),
  estado: z.string().nullable().optional(),
  cep: z.string().nullable().optional(),
  complemento: z.string().nullable().optional(),
})

export const clienteSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  cpf: z.string().nullable().optional(),
  dataCadastro: z.union([z.coerce.date(), z.null(), z.undefined()]).transform((v) => v ?? null),
  ativo: z.number(),
  role: z.number(),
  addresses: z.array(clienteAddressSchema).optional().default([]),
})

export type Cliente = z.infer<typeof clienteSchema>
