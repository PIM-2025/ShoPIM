export const statusOptions = [
  { label: 'Ativo', value: '1' },
  { label: 'Inativo', value: '0' },
] as const

export const roleOptions = [
  { label: 'Admin', value: '1' },
  { label: 'Cliente', value: '2' },
] as const

export const statusStyles = new Map<number, string>([
  [1, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [0, 'bg-neutral-300/40 border-neutral-300'],
])
