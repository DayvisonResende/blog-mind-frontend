# Blog Mind — Frontend

Interface web do sistema de blog full-stack desenvolvido para o **Case de Estágio da Mind Group**.
Consome a API REST do [blog-mind-backend](https://github.com/DayvisonResende/blog-mind-backend).

## Stack

- **React 19 + Vite** · **TypeScript**
- **React Router** — rotas públicas e privadas
- **Tailwind CSS v4 + shadcn/ui** — tema dark/light por tokens
- **React Hook Form + Zod** — validação de formulários
- **Axios** — cliente HTTP com interceptors de JWT e de erros
- **react-markdown** — renderização do conteúdo dos artigos
- **Vitest + Testing Library** — testes automatizados

## Pré-requisitos

- Node.js LTS (18+)
- **Backend rodando** (ver [blog-mind-backend](https://github.com/DayvisonResende/blog-mind-backend))

## 1. Instalação

```bash
git clone https://github.com/DayvisonResende/blog-mind-frontend.git
cd blog-mind-frontend
npm install
```

## 2. Variáveis de ambiente

Crie um arquivo `.env` na raiz a partir do `.env.example`:

```env
VITE_API_URL=http://localhost:3333
```

## 3. Executar

```bash
npm run dev       # desenvolvimento — http://localhost:5173
npm run build     # build de produção
npm run preview   # pré-visualiza o build
```

> **Importante:** suba o backend primeiro (porta 3333). Sem ele, as telas ficam sem dados.

## Credenciais de teste

Use qualquer usuário do seed com a senha **`senha123`** — ex.: `john@example.com`.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm test` | Testes (Vitest + Testing Library) |
| `npm run lint` | ESLint |

## Rotas

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Home (hero, destaques, recentes, newsletter) | Público |
| `/login` · `/cadastro` | Login e cadastro | Público |
| `/artigos` | Listagem (busca, filtro, grid/lista) | Público |
| `/artigos/:id` | Detalhe (markdown, comentários, curtir/salvar) | Público |
| `/artigos/novo` · `/artigos/:id/editar` | Criar / editar artigo | Protegido |
| `/dashboard` | Estatísticas, meus artigos, atividade recente | Protegido |
| `/configuracoes` | Perfil | Protegido |

## Tema claro/escuro

O tema padrão é **escuro**. Use o ícone de **lua/sol** no header para alternar — a
preferência é persistida no `localStorage` e respeita o `prefers-color-scheme` do sistema.

## Estrutura

```
src/
  pages/        # telas
  components/   # ui (shadcn), layout, article, comuns
  contexts/     # Auth e Theme
  hooks/        # useAuth, useTheme, useAsync, useDebounce
  services/     # cliente axios e chamadas à API
  lib/          # utils, validações, formatação
  types/        # tipos da API
```

---

Desenvolvido por [Dayvison Resende](https://github.com/DayvisonResende).
