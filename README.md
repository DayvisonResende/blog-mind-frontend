# Blog Mind — Frontend

Interface web do sistema de blog full-stack desenvolvido para o Case de Estágio da **Mind Group**.
Consome a API REST do [blog-mind-backend](https://github.com/DayvisonResende/blog-mind-backend).

> 🚧 Projeto em desenvolvimento — este README será completado ao longo das fases.

## Stack

- **React + Vite** · **TypeScript**
- **React Router** (rotas públicas/privadas)
- **Tailwind CSS** (+ shadcn/ui) — tema dark/light por tokens
- **React Hook Form + Zod** — validação de formulários
- **Axios** — cliente HTTP com interceptors de JWT e erros

## Pré-requisitos

- Node.js LTS (18+)
- Backend rodando (ver [blog-mind-backend](https://github.com/DayvisonResende/blog-mind-backend))

## Variáveis de ambiente

Crie um arquivo `.env` na raiz a partir do `.env.example`:

```env
VITE_API_URL=http://localhost:3333
```

## Instalação e execução

```bash
# instalar dependências
npm install

# rodar em desenvolvimento
npm run dev

# build de produção
npm run build
```

A aplicação sobe em `http://localhost:5173` (padrão do Vite).

## Estrutura

```
src/
  pages/       # home, listagem, detalhe, login, cadastro, dashboard, criar/editar, configuracoes
  components/  # card, header, footer, inputs, modal, dropdown, toasts, skeletons
  services/    # cliente HTTP e chamadas à API
  contexts/    # Auth e Theme (dark/light)
  hooks/
  types/
  styles/      # tokens / estilos
```

## Rotas

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Home (hero, destaques, recentes, newsletter) | Público |
| `/login` | Login | Público |
| `/cadastro` | Cadastro | Público |
| `/artigos` | Listagem (busca, filtro, grid/lista) | Público |
| `/artigos/:id` | Detalhe do artigo (comentários, curtidas) | Público |
| `/artigos/novo` | Criar artigo | Protegido |
| `/artigos/:id/editar` | Editar artigo | Protegido (autor) |
| `/dashboard` | Dashboard (estatísticas, meus artigos) | Protegido |
| `/configuracoes` | Configurações do perfil | Protegido |

## Tema claro/escuro

O tema padrão é **escuro**. Use o ícone de **lua** no header para alternar; a preferência é persistida no `localStorage` e respeita o `prefers-color-scheme` do sistema.

## Credenciais de teste

_(preencher com o usuário/senha do seed do backend)_

---

Desenvolvido por [Dayvison Resende](https://github.com/DayvisonResende).
