# 🛒 ShoPIM - E-commerce

O **ShoPIM** é uma plataforma de e-commerce desenvolvida como parte do Projeto Integrado Multidisciplinar (PIM) para a **UNIP (Universidade Paulista)**. O objetivo do projeto é simular um ambiente real de vendas online, integrando uma interface moderna com um backend robusto e escalável.

---

## 🚀 Tecnologias Utilizadas

O projeto utiliza uma arquitetura separada entre Frontend e Backend (Client-Server):

### **Frontend**
* **React + Vite:** Framework para uma interface rápida e reativa.
* **TanStack (React Query):** Gerenciamento de estado e requisições HTTP.
* **TypeScript:** Tipagem estática para maior segurança no código.
* **Shadcn/UI & Tailwind CSS:** Estilização moderna e componentes acessíveis.

### **Backend**
* **ASP.NET Core:** Framework de alto desempenho para a construção de APIs.
* **C#:** Linguagem principal do backend.
* **Entity Framework Core:** ORM para comunicação com o banco de dados.
* **Arquitetura MVC:** Organização clara entre Models, Views e Controllers.

---

## 📂 Estrutura do Repositório

O repositório está dividido em duas pastas principais:

1.  **`/FrontEnd`**: Contém todo o código da interface do usuário, configurações do Vite, Tailwind e componentes React.
2.  **`/BackEnd`**: Contém a API em ASP.NET Core, incluindo a lógica de negócio, acesso a dados e as rotas da aplicação.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
* Node.js (v18 ou superior)
* SDK do .NET Core (v6.0 ou superior)
* Gerenciador de pacotes `pnpm` (ou npm/yarn)

### Configurando o Backend
1. Navegue até a pasta: `cd BackEnd/ShoPIM`
2. Restaure as dependências: `dotnet restore`
3. Execute a aplicação: `dotnet run`
   * A API estará disponível em `http://localhost:5000` (ou na porta configurada em `appsettings.json`).

### Configurando o Frontend
1. Navegue até a pasta: `cd FrontEnd`
2. Instale as dependências: `pnpm install`
3. Inicie o servidor de desenvolvimento: `pnpm dev`
4. Acesse no navegador: `http://localhost:5173`

---

## 📝 Requisitos Funcionais
### 📦 Produtos
- [x] RF01: O sistema deve permitir a listagem de produtos
- [ ] RF02: O sistema deve permitir visualizar detalhes do produto
- [ ] RF03: O sistema deve permitir buscar produtos por nome
      
### 🛒 Carrinho
- [x] RF04: O sistema deve permitir adicionar produtos ao carrinho
- [x] RF05: O sistema deve permitir remover produtos do carrinho
- [x] RF06: O sistema deve permitir alterar quantidade de itens
      
### 👤 Usuário
- [x] RF07: O sistema deve permitir o cadastro de usuários
- [x] RF08: O sistema deve permitir o login de usuários
- [x] RF09: O sistema deve permitir logout
      
### 📦 Pedidos
- [ ] RF10: O sistema deve permitir criar pedidos
- [ ] RF11: O sistema deve permitir visualizar histórico de pedidos
- [ ] RF12: O sistema deve atualizar o status do pedido (ex: em processamento)
      
### 🔗 Integração
- [x] RF13: O frontend deve consumir dados da API backend
- [x] RF14: O sistema deve validar dados enviados entre frontend e backend

## ⚙️ Requisitos Não Funcionais
### 🚀 Performance
- [ ] RNF01: O sistema deve responder requisições em até 2 segundos
- [x] RNF02: A interface deve carregar rapidamente (uso do Vite)

### 🔒 Segurança
- [ ] RNF03: O sistema deve garantir autenticação segura (JWT, por exemplo)
- [x] RNF04: Dados sensíveis devem ser protegidos

### 🧱 Arquitetura
- [x] RNF05: O sistema deve seguir arquitetura Client-Server
- [x] RNF06: O backend deve seguir padrão MVC
- [x] RNF07: O sistema deve ser modular (frontend separado do backend)

### 📱 Usabilidade
- [x] RNF08: A interface deve ser responsiva (Tailwind CSS)
- [x] RNF09: O sistema deve ser intuitivo para o usuário

### 🔄 Escalabilidade
- [x] RNF10: O backend deve suportar aumento de usuários
- [x] RNF11: O sistema deve permitir futuras integrações (ex: pagamento)

### 🧪 Manutenibilidade
- [x] RNF12: O código deve ser tipado (TypeScript)
- [x] RNF13: O sistema deve ser de fácil manutenção (uso de ORM)

---

## 👥 Integrantes do Grupo
* **Jean Campos**
* **João Pedro**
* **Gabriel Massari**
* **Ramon Guimarães**

---

## 📄 Licença
Este projeto foi desenvolvido para fins estritamente acadêmicos.
