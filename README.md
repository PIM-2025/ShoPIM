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

## 📝 Funcionalidades (PIM)
- [x] Listagem de produtos
- [x] Carrinho de compras
- [ ] Integração com API Backend
- [ ] Gerenciamento de pedidos
- [ ] Autenticação de usuários (em desenvolvimento)

---

## 👥 Integrantes do Grupo
* **Jean Campos** - RA: 0000000
* **João Pedro** - RA: R8975J5
* **Gabriel Massari** - RA: 0000000
* **Ramon Guimarães** - RA: 0000000

---

## 📄 Licença
Este projeto foi desenvolvido para fins estritamente acadêmicos.
