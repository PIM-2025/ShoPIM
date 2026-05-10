UNIVERSIDADE PAULISTA – UNIP

CURSO SUPERIOR DE TECNOLOGIA EM ANÁLISE E DESENVOLVIMENTO DE SISTEMAS

PROJETO INTEGRADO MULTIDISCIPLINAR – PIM


DOCUMENTAÇÃO GERAL DO REPOSITÓRIO SHOPIM:
LINGUAGENS E TECNOLOGIAS UTILIZADAS NO FRONTEND, BACKEND E BANCO DE DADOS


Integrantes:
Jean Campos
João Pedro
Gabriel Massari
Ramon Guimarães


São Paulo
2026

---

# RESUMO

Este documento apresenta a documentação técnica geral do repositório **ShoPIM**, plataforma de comércio eletrônico desenvolvida como Projeto Integrado Multidisciplinar (PIM) do curso superior de tecnologia em Análise e Desenvolvimento de Sistemas da Universidade Paulista (UNIP). O objetivo principal é descrever, de forma organizada e fundamentada, todas as linguagens de programação, linguagens de marcação, linguagens de consulta e tecnologias auxiliares empregadas em cada uma das três camadas do sistema: interface (frontend), serviços de aplicação (backend) e persistência (banco de dados). A metodologia adotada baseou-se na análise estática do código-fonte do repositório, na inspeção dos arquivos de configuração de pacotes (`package.json`, `ShoPIM.csproj`), nos scripts de criação do banco de dados (`create.sql`) e na revisão da documentação oficial das tecnologias identificadas. Como resultado, o trabalho consolida o conjunto tecnológico do ShoPIM em uma arquitetura cliente-servidor de três camadas, na qual o frontend, escrito em TypeScript com React 19 e Vite, comunica-se com um backend em C# sobre ASP.NET Core (.NET 10), o qual utiliza o Entity Framework Core para persistir dados em uma base Oracle 11g modelada em SQL/PL-SQL. Conclui-se que a stack escolhida favorece a separação de responsabilidades, a manutenibilidade, a tipagem estática em ambas as camadas e a escalabilidade do sistema.

**Palavras-chave:** ShoPIM. E-commerce. TypeScript. C#. ASP.NET Core. Oracle. Documentação técnica.

---

# ABSTRACT

This document presents the general technical documentation of the **ShoPIM** repository, an e-commerce platform developed as the Multidisciplinary Integrated Project (PIM) for the Technology Degree in Systems Analysis and Development at Universidade Paulista (UNIP). The main goal is to describe, in an organized and grounded way, every programming language, markup language, query language and supporting technology used in each of the three layers of the system: user interface (frontend), application services (backend) and persistence (database). The methodology relied on the static analysis of the repository source code, on the inspection of package configuration files (`package.json`, `ShoPIM.csproj`), on the database creation scripts (`create.sql`) and on the review of the official documentation of the identified technologies. As a result, the work consolidates the ShoPIM technology stack into a three-tier client-server architecture, in which the frontend, written in TypeScript with React 19 and Vite, communicates with a backend written in C# on top of ASP.NET Core (.NET 10), which uses Entity Framework Core to persist data into an Oracle 11g database modeled in SQL/PL-SQL. The conclusion is that the chosen stack favors separation of concerns, maintainability, static typing in both layers and overall system scalability.

**Keywords:** ShoPIM. E-commerce. TypeScript. C#. ASP.NET Core. Oracle. Technical documentation.

---

# SUMÁRIO

1. INTRODUÇÃO
2. VISÃO GERAL DA ARQUITETURA
3. CAMADA DE FRONTEND
   - 3.1 Linguagens
   - 3.2 Frameworks e bibliotecas principais
   - 3.3 Ferramentas de build, qualidade e empacotamento
4. CAMADA DE BACKEND
   - 4.1 Linguagens
   - 4.2 Plataforma e frameworks
   - 4.3 Bibliotecas e pacotes NuGet
   - 4.4 Estrutura interna (Controllers, Models, Hubs, Areas)
5. CAMADA DE BANCO DE DADOS
   - 5.1 Linguagens
   - 5.2 SGBD e modelagem
   - 5.3 Estrutura das tabelas
6. COMUNICAÇÃO ENTRE CAMADAS
7. DEVOPS, FERRAMENTAS DE APOIO E CONTROLE DE VERSÃO
8. CONCLUSÃO
9. REFERÊNCIAS

---

# 1. INTRODUÇÃO

O **ShoPIM** é uma aplicação web de comércio eletrônico construída ao longo do Projeto Integrado Multidisciplinar do curso de Análise e Desenvolvimento de Sistemas da UNIP. Trata-se de um sistema completo, organizado em arquitetura cliente-servidor, no qual a interface do usuário e a lógica de negócio são entregues por projetos independentes que se comunicam por meio de uma API HTTP/REST e de canais em tempo real via WebSockets.

Este documento tem como objetivo apresentar, de forma centralizada, todas as linguagens utilizadas em cada um dos processos do repositório – interface gráfica, serviços de aplicação e persistência de dados – descrevendo o papel de cada uma delas, os principais frameworks e bibliotecas adotados, e as ferramentas de apoio que sustentam o ciclo de desenvolvimento.

A metodologia utilizada na elaboração do material consistiu na análise direta do código-fonte do repositório, na leitura dos arquivos de manifesto (`package.json` para o frontend e `ShoPIM.csproj` para o backend), no exame dos scripts de criação do banco de dados (`create.sql` e `drop.sql`) e na confrontação dessas informações com a documentação oficial das tecnologias identificadas. O conteúdo está estruturado em seções específicas para cada camada, seguidas por seções sobre comunicação entre as camadas e ferramentas de apoio.

---

# 2. VISÃO GERAL DA ARQUITETURA

O repositório ShoPIM adota uma arquitetura cliente-servidor desacoplada, dividida em três grandes camadas:

a) **Frontend (camada de apresentação)** – pasta `FrontEnd/`. Aplicação Single Page Application (SPA) escrita em TypeScript, executada no navegador do usuário, responsável por renderizar a interface, gerenciar o estado local da sessão e consumir a API.

b) **Backend (camada de aplicação)** – pasta `BackEnd/`. API Web em ASP.NET Core (.NET 10), responsável por implementar regras de negócio, autenticação, autorização, comunicação em tempo real e o acesso ao banco de dados por meio de um ORM.

c) **Banco de Dados (camada de persistência)** – pasta `Modelagem/BD/`. Base relacional Oracle, modelada com a ferramenta DeZign for Databases e materializada por scripts SQL/PL-SQL.

A comunicação entre o frontend e o backend ocorre principalmente por meio de requisições HTTP no formato JSON (REST) e, em casos de chat e notificações, por WebSockets utilizando a biblioteca SignalR. A persistência é feita pelo Entity Framework Core, que abstrai os comandos SQL emitidos contra o banco Oracle.

Repositório (estrutura simplificada):

```
ShoPIM/
├── BackEnd/
│   ├── BackEnd.sln
│   └── ShoPIM/                (projeto ASP.NET Core)
│       ├── ShoPIM.csproj
│       ├── Program.cs
│       ├── Controllers/
│       ├── Models/
│       ├── Data/
│       ├── Hubs/ChatHub.cs
│       ├── Areas/Identity/
│       ├── appsettings.json
│       └── Dockerfile
├── FrontEnd/                  (aplicação Vite + React 19)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── service/
│       ├── stores/
│       └── routes/
├── Modelagem/
│   └── BD/
│       ├── create.sql
│       ├── drop.sql
│       └── Modelo.dez
└── README.md
```

---

# 3. CAMADA DE FRONTEND

A camada de frontend é uma SPA construída a partir do template **shadcn-admin**, com versão registrada `2.2.1` no manifesto `FrontEnd/package.json`, gerenciada pelo `pnpm`.

## 3.1 Linguagens

| Linguagem | Papel no projeto | Onde aparece |
|-----------|------------------|--------------|
| **TypeScript** | Linguagem principal, fornece tipagem estática sobre JavaScript. | Arquivos `.ts` e `.tsx` em `src/` |
| **TSX (TypeScript + JSX)** | Sintaxe de marcação para componentes React. | `src/pages/**/*.tsx`, `src/components/**/*.tsx` |
| **JavaScript** | Apenas em arquivos de configuração que ainda não foram migrados para TS. | `eslint.config.js`, configurações pontuais |
| **HTML** | Documento raiz da aplicação. | `index.html` |
| **CSS / Tailwind CSS** | Linguagem de estilo. Tailwind 4 utiliza diretivas próprias (`@theme`, `@layer`) embutidas em arquivos CSS. | `src/styles/*.css` |
| **JSON** | Configuração de pacotes, regras do TypeScript, do ESLint e do Prettier. | `package.json`, `tsconfig*.json`, `components.json` |
| **Markdown** | Documentação textual auxiliar. | `README.md` |

## 3.2 Frameworks e bibliotecas principais

Conforme o `package.json` do projeto:

- **React 19** (`react`, `react-dom`) – biblioteca de construção de interfaces baseada em componentes.
- **Vite 8** (`vite`) – servidor de desenvolvimento e empacotador (bundler) com Hot Module Replacement.
- **TanStack Router** (`@tanstack/react-router`) – roteamento client-side com geração de tipos a partir de árvore de rotas.
- **TanStack Query** (`@tanstack/react-query`) – cache e sincronização de dados servidor → cliente.
- **TanStack Table** (`@tanstack/react-table`) – tabelas avançadas (ordenação, filtros, paginação) usadas em painéis administrativos.
- **Radix UI** (`@radix-ui/*`) – primitivos acessíveis para componentes complexos (Dialog, DropdownMenu, Tabs etc.).
- **shadcn/ui** – conjunto de componentes pré-construídos sobre Radix e Tailwind, instalados via CLI e versionados em `src/components/ui`.
- **Tailwind CSS 4** – framework utilitário de CSS.
- **Zustand** – gerenciamento de estado global de UI (`src/stores/auth-store.ts`, `src/stores/cart-store.ts`).
- **Zod** – validação e inferência de schemas em tempo de execução.
- **React Hook Form** – formulários performáticos integrados ao Zod.
- **Axios** – cliente HTTP utilizado nos serviços (`src/service/*.ts`).
- **@microsoft/signalr** – cliente WebSocket compatível com o `ChatHub` do backend, utilizado nas páginas de chat.
- **Recharts** – gráficos no painel/dashboard.
- **date-fns** – manipulação de datas.

## 3.3 Ferramentas de build, qualidade e empacotamento

- **pnpm** – gerenciador de pacotes.
- **ESLint + Prettier** – análise estática e formatação consistente.
- **TypeScript Compiler (tsc)** – verificação de tipos em paralelo ao Vite.
- **PostCSS / autoprefixer** – pipeline de processamento de CSS quando necessário.
- **gh-pages / configurações de Vercel e Netlify** – publicação do build estático.

---

# 4. CAMADA DE BACKEND

A camada de backend é um projeto ASP.NET Core localizado em `BackEnd/ShoPIM/`. O arquivo de manifesto `ShoPIM.csproj` declara `TargetFramework=net10.0`, ou seja, executa sobre o **.NET 10**.

## 4.1 Linguagens

| Linguagem | Papel no projeto | Onde aparece |
|-----------|------------------|--------------|
| **C#** | Linguagem principal: controllers, modelos, DTOs, hubs, serviços, configuração. | Arquivos `.cs` em `BackEnd/ShoPIM/**` |
| **Razor (cshtml)** | Páginas de identidade prontas (login, registro, recuperação de senha) fornecidas pelo ASP.NET Identity. | `Areas/Identity/**` |
| **SQL** | Comandos emitidos indiretamente pelo Entity Framework Core (LINQ → SQL) e em migrações. | Geração via EF Core / migrações |
| **JSON** | Configuração da aplicação. | `appsettings.json`, `appsettings.Development.json` |
| **Dockerfile** | Linguagem de instruções para construção da imagem Docker do backend. | `BackEnd/ShoPIM/Dockerfile` |
| **XML** | Manifesto do projeto MSBuild. | `ShoPIM.csproj`, `BackEnd.sln` |

## 4.2 Plataforma e frameworks

- **.NET 10 / ASP.NET Core** – plataforma de execução, roteamento HTTP, injeção de dependência e middleware.
- **ASP.NET Core Web API** – exposição de endpoints REST (controllers em `Controllers/`).
- **ASP.NET Core SignalR** – comunicação em tempo real (chat). Implementado em `Hubs/ChatHub.cs`.
- **ASP.NET Core Identity** – cadastro, login e gestão de usuários, com páginas Razor padrão na área `Areas/Identity`.
- **Entity Framework Core 10** – ORM utilizado para mapear classes C# em tabelas Oracle.

## 4.3 Bibliotecas e pacotes NuGet

Lista extraída do `ShoPIM.csproj`:

- `BCrypt.Net-Next` 4.1.0 – hash de senhas com BCrypt.
- `MailKit` 4.15.1 – envio de e-mails (SMTP) para confirmações e recuperação de senha.
- `Google.Apis.Auth` 1.73.0 – validação de tokens de login social (Google OAuth).
- `Microsoft.AspNetCore.Authentication.JwtBearer` 10.0.5 – autenticação por JWT.
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore` 10.0.5 – persistência das entidades de Identity via EF Core.
- `Microsoft.AspNetCore.Identity.UI` 10.0.5 – UI padrão (Razor) para o Identity.
- `Microsoft.AspNetCore.OpenApi` 10.0.5 – metadados OpenAPI.
- `Microsoft.EntityFrameworkCore.Tools` 10.0.5 – ferramentas de linha de comando para migrações.
- `Oracle.EntityFrameworkCore` 10.23.26100 – provedor EF Core para Oracle.
- `Oracle.ManagedDataAccess.Core` 23.26.100 – driver ADO.NET nativo Oracle.
- `Swashbuckle.AspNetCore` 10.1.7 – Swagger UI / OpenAPI.
- `System.IdentityModel.Tokens.Jwt` 8.17.0 – emissão e validação de tokens JWT.

## 4.4 Estrutura interna

- **`Program.cs`** – ponto de entrada e composição do pipeline de middleware.
- **`Controllers/`** – `AuthController`, `AvaliacaoController`, `CartController`, `ChatController`, `ConfiguracaoController`, `DashboardController`, `FreteController`, `PedidoController`, `PerguntaController`, `ProductController`, `UsersController`.
- **`Models/`** – `Address`, `Avaliacao`, `Cart`, `Configuracao`, `Contact`, `Conversa`, `ItemPedido`, `Mensagem`, `Pedido`, `Pergunta`, `Product`, `UserRole`, `Users`, com subpasta `DTOs` para objetos de transporte.
- **`Data/`** – contexto do EF Core e configurações de mapeamento.
- **`Hubs/ChatHub.cs`** – hub do SignalR para mensagens em tempo real entre clientes e atendentes.
- **`Areas/Identity/`** – páginas Razor de autenticação.
- **`wwwroot/`** – arquivos estáticos servidos diretamente pelo backend (quando aplicável).
- **`Dockerfile`** – containerização da API.

---

# 5. CAMADA DE BANCO DE DADOS

A persistência do ShoPIM é feita em uma base relacional **Oracle Database 11g**, modelada graficamente na ferramenta **DeZign for Databases V8.1.2** (arquivo `Modelagem/BD/Modelo.dez`) e materializada pelos scripts `create.sql` e `drop.sql`.

## 5.1 Linguagens

| Linguagem | Papel no projeto |
|-----------|------------------|
| **SQL (DDL)** | Definição de tabelas, colunas, tipos (`VARCHAR2`, `NUMBER`, `DATE`, `TIMESTAMP`), restrições (`PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `CHECK`) e sequências. |
| **SQL (DML)** | Inserções, atualizações e consultas geradas dinamicamente pelo Entity Framework Core. |
| **PL/SQL** | Dialeto procedural da Oracle. Embora o projeto não exiba procedures explícitas, o uso de sequências (`SEQ_*`) e gatilhos potenciais segue a sintaxe PL/SQL. |

## 5.2 SGBD e modelagem

- **SGBD:** Oracle Database 11g.
- **Ferramenta de modelagem:** DeZign for Databases V8.1.2 – arquivo `.dez` (binário) que registra o modelo lógico/físico.
- **Provedor de acesso:** `Oracle.ManagedDataAccess.Core` (driver gerenciado) acessado pelo provedor `Oracle.EntityFrameworkCore` no backend.

## 5.3 Estrutura das tabelas

As tabelas declaradas no `create.sql` formam o núcleo do domínio do e-commerce. Entre elas:

- **USERS** – cadastro principal de usuários (id, nome, e-mail, senha, perfil, datas).
- **CONTACT** – contatos/telefones associados a usuários.
- **ADDRESS** – endereços de entrega/cobrança.
- **PRODUCT** – catálogo de produtos.
- **CART** – itens do carrinho de compras.
- **PEDIDO** – pedidos efetivados.
- **ITEM_PEDIDO** – linhas de pedido.
- **CONFIGURACAO** – parâmetros gerais do sistema.
- **PERGUNTA** – perguntas dos clientes sobre produtos.
- **AVALIACAO** – avaliações dos produtos, com restrição de unicidade `(ID_USER, ID_PRODUTO)` e `CHECK (NOTA BETWEEN 1 AND 5)`.
- **CONVERSA** e **MENSAGEM** – persistência das conversas trocadas via chat (SignalR).

As chaves estrangeiras são declaradas com `ON DELETE CASCADE` ou `ON DELETE SET NULL`, e cada tabela possui sua sequência associada (`SEQ_USERS`, `SEQ_PRODUCT`, etc.) para geração de identificadores numéricos – padrão clássico no Oracle 11g, anterior ao recurso `IDENTITY` introduzido no 12c.

---

# 6. COMUNICAÇÃO ENTRE CAMADAS

A integração entre as três camadas se apoia em três protocolos principais:

a) **HTTP/REST com JSON** – o frontend, através do Axios, consome os endpoints expostos pelos `Controllers` do backend. As regras de serialização e de versão de API são descritas pelo Swagger/OpenAPI gerado por Swashbuckle.

b) **WebSockets via SignalR** – o `ChatHub.cs` do backend e o cliente `@microsoft/signalr` no frontend trocam mensagens em tempo real para o chat de atendimento, com fallback automático entre transporte WebSockets, Server-Sent Events e Long Polling, conforme especificação do SignalR.

c) **Autenticação por JWT e OAuth 2.0** – os tokens JWT são emitidos pelo `AuthController` e validados pelo middleware `JwtBearer`. Adicionalmente, o login social usa `Google.Apis.Auth` para validar tokens de identidade emitidos pelo Google.

A persistência ocorre em uma quarta interação: o backend, por meio do EF Core, traduz operações LINQ em SQL Oracle, executando-as via `Oracle.ManagedDataAccess.Core`.

---

# 7. DEVOPS, FERRAMENTAS DE APOIO E CONTROLE DE VERSÃO

- **Git e GitHub** – controle de versão, com fluxo de pull requests.
- **GitHub Actions** (pasta `.github/`) – execução de pipelines de integração contínua.
- **Docker** – containerização do backend (`BackEnd/ShoPIM/Dockerfile`).
- **pnpm** – instalação determinística das dependências do frontend.
- **Vercel / Netlify / gh-pages** – alternativas de publicação do build estático do frontend.
- **Visual Studio / VS Code** – IDEs utilizadas pela equipe.
- **DeZign for Databases** – modelagem visual do banco.
- **Swagger UI** – documentação interativa da API durante o desenvolvimento.

---

# 8. CONCLUSÃO

A análise do repositório ShoPIM evidencia a adoção de um conjunto tecnológico moderno e coeso, no qual cada linguagem cumpre um papel claramente definido em sua respectiva camada. No frontend, **TypeScript** combinado a **React 19**, **Vite** e ao ecossistema **TanStack** garante uma SPA tipada, performática e modular. No backend, **C#** sobre **ASP.NET Core (.NET 10)** entrega uma API robusta com autenticação JWT, comunicação em tempo real via SignalR, integração com Google OAuth e persistência via Entity Framework Core. Na camada de dados, o uso de **SQL/PL-SQL Oracle 11g**, modelado em ferramenta visual e materializado em scripts versionados, oferece integridade referencial, restrições de domínio e geração de identificadores via sequências.

A combinação dessas tecnologias atende aos requisitos funcionais e não funcionais documentados no projeto, especialmente os relativos a arquitetura cliente-servidor (RNF05), separação modular (RNF07), responsividade (RNF08), tipagem estática (RNF12) e manutenibilidade via ORM (RNF13). Como evolução, recomenda-se a documentação contínua das migrações do EF Core, a formalização das políticas de versionamento da API e a adoção de testes automatizados em ambas as camadas, consolidando boas práticas de engenharia de software.

---

# 9. REFERÊNCIAS

MICROSOFT. **ASP.NET Core documentation**. Disponível em: https://learn.microsoft.com/aspnet/core. Acesso em: 10 maio 2026.

MICROSOFT. **Entity Framework Core documentation**. Disponível em: https://learn.microsoft.com/ef/core. Acesso em: 10 maio 2026.

MICROSOFT. **C# language reference**. Disponível em: https://learn.microsoft.com/dotnet/csharp. Acesso em: 10 maio 2026.

MICROSOFT. **SignalR for ASP.NET Core**. Disponível em: https://learn.microsoft.com/aspnet/core/signalr. Acesso em: 10 maio 2026.

ORACLE. **Oracle Database 11g Documentation**. Disponível em: https://docs.oracle.com/cd/E11882_01/index.htm. Acesso em: 10 maio 2026.

ORACLE. **Oracle Data Provider for .NET**. Disponível em: https://www.oracle.com/database/technologies/net-downloads.html. Acesso em: 10 maio 2026.

REACT. **React Documentation**. Disponível em: https://react.dev. Acesso em: 10 maio 2026.

VITE. **Vite – Next Generation Frontend Tooling**. Disponível em: https://vitejs.dev. Acesso em: 10 maio 2026.

TANSTACK. **TanStack Router, Query and Table Documentation**. Disponível em: https://tanstack.com. Acesso em: 10 maio 2026.

TAILWIND LABS. **Tailwind CSS v4 Documentation**. Disponível em: https://tailwindcss.com. Acesso em: 10 maio 2026.

RADIX UI. **Radix Primitives**. Disponível em: https://www.radix-ui.com. Acesso em: 10 maio 2026.

SHADCN. **shadcn/ui – Beautifully designed components**. Disponível em: https://ui.shadcn.com. Acesso em: 10 maio 2026.

TYPESCRIPT. **TypeScript Documentation**. Disponível em: https://www.typescriptlang.org/docs. Acesso em: 10 maio 2026.

DOCKER. **Docker Documentation**. Disponível em: https://docs.docker.com. Acesso em: 10 maio 2026.

JWT.IO. **JSON Web Tokens – Introduction**. Disponível em: https://jwt.io/introduction. Acesso em: 10 maio 2026.

ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. **NBR 6023**: informação e documentação – referências – elaboração. Rio de Janeiro: ABNT, 2018.

ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. **NBR 14724**: informação e documentação – trabalhos acadêmicos – apresentação. Rio de Janeiro: ABNT, 2011.
