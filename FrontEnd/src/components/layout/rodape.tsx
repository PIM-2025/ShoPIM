import { Cat } from 'lucide-react';

export function Rodape(){
    return(
        <footer className="w-full bg-background text-foreground border-t border-border px-8 pt-12 pb-6">

  
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-border">

                <div className="col-span-2 md:col-span-1">
                <h2 className="font-serif text-2xl font-semibold text-foreground tracking-tight mb-2">ShoPIM</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
                    A ShoPIM é uma plataforma de e-commerce desenvolvida como projeto acadêmico.
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Novidades exclusivas</p>
                <div className="flex border border-border rounded-md overflow-hidden">
                    <input
                        type="email"
                        placeholder="seu@email.com"
                        className="bg-transparent flex-1 min-w-0 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <button className="bg-orange-400 text-neutral-900 text-xs font-medium px-4 py-2 hover:bg-orange-500 transition-colors whitespace-nowrap shrink-0">
                        Inscrever
                    </button>
                </div>
                </div>

                <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Categorias</h3>
                <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Eletrônicos</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Roupas</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Acessórios</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Ofertas</a></li>
                </ul>
                </div>

                <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Suporte</h3>
                <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Central de ajuda</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Trocas e devoluções</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Rastrear pedido</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Fale conosco</a></li>
                </ul>
                </div>

                <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Empresa</h3>
                <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Sobre nós</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Sustentabilidade</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Afiliados</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Política de privacidade</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-orange-400 hover:underline underline-offset-4 transition-colors">Termos de uso</a></li>
                </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6 flex-wrap">
                <span className="text-xs text-muted-foreground">© 2026 SHOPIM. Todos os direitos reservados.</span>

                <div className="flex flex-wrap gap-2">
                <span className="bg-muted border border-border rounded px-2.5 py-1 text-xs text-muted-foreground">Pix</span>
                <span className="bg-muted border border-border rounded px-2.5 py-1 text-xs text-muted-foreground">Cartão</span>
                <span className="bg-muted border border-border rounded px-2.5 py-1 text-xs text-muted-foreground">Boleto</span>
                </div>

                <div className="flex gap-2">
                <a href="https://github.com/PIM-2025/ShoPIM" target="_blank" className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"><Cat/></a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-wrap gap-6 mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                Frete grátis
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                Troca em até 30 dias
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                Pagamento 100% seguro
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                Atendimento via WhatsApp
                </div>
            </div>
        </footer>
    )
}