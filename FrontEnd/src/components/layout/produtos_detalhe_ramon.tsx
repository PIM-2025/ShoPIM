export function ProdutoDetalhe() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* IMAGEM */}
      <div className="md:col-span-1">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 flex items-center justify-center">
          <img
            src="https://http2.mlstatic.com/D_NQ_NP_2X_682402-MLA99403901858_112025-F.webp"
            className="max-h-[300px] object-contain"
          />
        </div>
      </div>

      {/* INFO */}
      <div className="md:col-span-1 space-y-4">
        <h1 className="text-2xl font-bold">
          Relógio Masculino Premium
        </h1>

        <p className="text-muted-foreground">
          Produto de alta qualidade com ótimo acabamento.
        </p>

        <div className="text-yellow-500">
          ★★★★☆ (4.8)
        </div>

        <div className="text-3xl font-bold text-green-600">
          R$ 199,90
        </div>
      </div>

      {/* COMPRA */}
      <div className="md:col-span-1">
        <div className="border border-border rounded-xl p-4 space-y-4 bg-background">

          <p className="text-2xl font-bold">
            R$ 199,90
          </p>

          <p className="text-green-600">
            Em estoque
          </p>

          <button className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:opacity-90">
            Adicionar ao carrinho
          </button>

          <button className=" bg-green-600 text-white py-2 rounded-lg hover:opacity-90">
            Comprar agora
          </button>

        </div>
      </div>

    </div>
  )
}