import { useEffect } from 'react'
import {
  getCart,
  adicionarItem,
  atualizarQuantidade,
  removerItem,
  CartItem,
} from '@/service/cartservice'
import { useCartStore } from '@/stores/cart-store'

const CART_KEY = 'shopim_cart'

// Variável de módulo síncrona — garante que só um componente inicializa o carrinho
// mesmo quando vários montam ao mesmo tempo (Zustand state é async, causaria race condition)
let _initializedForUser: number | null | undefined = undefined

interface LocalCartItem {
  idProduto: number
  quantidade: number
  produto: CartItem['produto']
}

function getLocalCart(): LocalCartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveLocalCart(items: LocalCartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

// Remove duplicatas do banco (mesmo idProduto com múltiplas linhas) e retorna lista limpa
async function limparDuplicatas(serverItems: CartItem[]): Promise<CartItem[]> {
  const porProduto = new Map<number, CartItem[]>()
  for (const item of serverItems) {
    const lista = porProduto.get(item.idProduto) ?? []
    lista.push(item)
    porProduto.set(item.idProduto, lista)
  }

  const resultado: CartItem[] = []
  for (const [, lista] of porProduto) {
    if (lista.length === 1) {
      resultado.push(lista[0])
      continue
    }
    // Tem duplicatas: mantém o primeiro, soma quantidades, deleta os extras
    lista.sort((a, b) => a.id - b.id)
    const totalQtd = lista.reduce((sum, i) => sum + i.quantidade, 0)
    await atualizarQuantidade(lista[0].id, totalQtd)
    for (const dup of lista.slice(1)) {
      await removerItem(dup.id)
    }
    resultado.push({ ...lista[0], quantidade: totalQtd })
  }
  return resultado
}

export function useCart(idUsuario: number | null) {
  const { items, loading, setItems, setLoading } = useCartStore()

  // Converte item local para o formato CartItem
  const localToCartItem = (local: LocalCartItem, index: number): CartItem => ({
    id: -(index + 1), // id negativo só pra ter key única no local
    idUsuario: 0,
    idProduto: local.idProduto,
    quantidade: local.quantidade,
    dataAdicao: new Date().toISOString(),
    produto: local.produto,
  })

  useEffect(() => {
    // Guard síncrono: se já inicializou para este usuário, não busca de novo
    if (_initializedForUser === idUsuario) return
    _initializedForUser = idUsuario

    if (idUsuario) {
      // Usuário logado → busca do banco, limpa duplicatas e sincroniza carrinho local
      setLoading(true)
      getCart(idUsuario)
        .then(async (serverItems) => {
          const cleanItems = await limparDuplicatas(serverItems)
          const localItems = getLocalCart()

          // Sincroniza itens do localStorage pro banco
          for (const local of localItems) {
            const jaExiste = cleanItems.find(
              (s) => s.idProduto === local.idProduto
            )
            if (!jaExiste) {
              await adicionarItem(idUsuario, local.idProduto, local.quantidade)
            }
          }

          // Limpa localStorage após sync
          if (localItems.length > 0) {
            localStorage.removeItem(CART_KEY)
            const updated = await getCart(idUsuario)
            setItems(await limparDuplicatas(updated))
          } else {
            setItems(cleanItems)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      // Não logado → usa localStorage
      const local = getLocalCart()
      setItems(local.map(localToCartItem))
      setLoading(false)
    }
  }, [idUsuario])

  const adicionar = async (
    idProduto: number,
    quantidade = 1,
    produto?: CartItem['produto']
  ) => {
    if (idUsuario) {
      // Optimistic update: reflete na UI imediatamente sem esperar o servidor
      if (produto) {
        const existente = items.find((i) => i.idProduto === idProduto)
        if (existente) {
          setItems(
            items.map((i) =>
              i.idProduto === idProduto
                ? { ...i, quantidade: i.quantidade + quantidade }
                : i
            )
          )
        } else {
          const tempItem: CartItem = {
            id: -Date.now(),
            idUsuario,
            idProduto,
            quantidade,
            dataAdicao: new Date().toISOString(),
            produto,
          }
          setItems([...items, tempItem])
        }
      }

      // Sincroniza com o servidor em background
      await adicionarItem(idUsuario, idProduto, quantidade)
      const updated = await getCart(idUsuario)
      setItems(updated)
    } else {
      const local = getLocalCart()
      const existente = local.find((i) => i.idProduto === idProduto)

      if (existente) {
        existente.quantidade += quantidade
      } else if (produto) {
        local.push({ idProduto, quantidade, produto })
      }

      saveLocalCart(local)
      setItems(local.map(localToCartItem))
    }
  }

  const atualizar = async (item: CartItem, increment: boolean) => {
    const novaQtd = Math.max(1, item.quantidade + (increment ? 1 : -1))

    // Optimistic update: reflete na UI imediatamente
    setItems(
      items.map((i) =>
        i.idProduto === item.idProduto ? { ...i, quantidade: novaQtd } : i
      )
    )

    if (idUsuario) {
      // Sincroniza com o servidor em background
      await atualizarQuantidade(item.id, novaQtd)
    } else {
      const local = getLocalCart()
      const found = local.find((i) => i.idProduto === item.idProduto)
      if (found) found.quantidade = novaQtd
      saveLocalCart(local)
    }
  }

  const remover = async (item: CartItem) => {
    // Optimistic update: remove da UI imediatamente
    setItems(items.filter((i) => i.idProduto !== item.idProduto))

    if (idUsuario) {
      // Sincroniza com o servidor em background
      await removerItem(item.id)
    } else {
      const local = getLocalCart().filter((i) => i.idProduto !== item.idProduto)
      saveLocalCart(local)
    }
  }

  return { items, loading, adicionar, atualizar, remover }
}
