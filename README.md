# Blog Mind (Frontend)

Interface web do blog full-stack que desenvolvi para o case de estágio da Mind Group.
Ela conversa com a API do [blog-mind-backend](https://github.com/DayvisonResende/blog-mind-backend).

## Tecnologias

- React 19 com Vite e TypeScript
- React Router para as rotas públicas e privadas
- Tailwind CSS v4 com shadcn/ui, e tema claro ou escuro por tokens
- React Hook Form com Zod para os formulários
- Axios como cliente HTTP, com interceptors para o JWT e para padronizar os erros
- react-markdown para renderizar o conteúdo dos artigos
- Vitest com Testing Library para os testes

## Antes de começar

Você vai precisar de Node.js LTS (18 ou mais recente) e do backend rodando. As instruções dele estão no [blog-mind-backend](https://github.com/DayvisonResende/blog-mind-backend).

## 1. Instalação

```bash
git clone https://github.com/DayvisonResende/blog-mind-frontend.git
cd blog-mind-frontend
npm install
```

## 2. Variáveis de ambiente

Copie o `.env.example` para um novo `.env`. Ele só precisa apontar para a API:

```env
VITE_API_URL=http://localhost:3333
```

## 3. Rodando

```bash
npm run dev       # desenvolvimento em http://localhost:5173
npm run build     # build de produção
npm run preview   # pré-visualiza o build
```

Suba o backend antes (na porta 3333). Sem ele, as telas carregam mas ficam sem dados.

## Login de teste

Use qualquer usuário do seed com a senha `senha123`, por exemplo o `john@example.com`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm test` | Roda os testes |
| `npm run lint` | Roda o ESLint |

## Telas

| Rota | O que tem | Acesso |
|---|---|---|
| `/` | Home com destaques, recentes e newsletter | Público |
| `/login` e `/cadastro` | Login e cadastro | Público |
| `/artigos` | Listagem com busca, filtro e visão em grade ou lista | Público |
| `/artigos/:id` | Detalhe com markdown, comentários, curtir e salvar | Público |
| `/artigos/novo` e `/artigos/:id/editar` | Criar e editar artigo | Protegido |
| `/dashboard` | Estatísticas, meus artigos e atividade recente | Protegido |
| `/salvos` | Artigos que o usuário salvou | Protegido |
| `/configuracoes` | Perfil, com upload da foto | Protegido |

## Tema claro e escuro

O tema padrão é o escuro. Dá para alternar no ícone de lua ou sol no header. A preferência fica salva no `localStorage` e respeita o `prefers-color-scheme` do sistema na primeira visita.

## Organização das pastas

```
src/
  pages/        as telas
  components/   ui (shadcn), layout, artigo e componentes comuns
  contexts/     Auth e Theme
  hooks/        useAuth, useTheme, useAsync, useDebounce e outros
  services/     o cliente axios e as chamadas à API
  lib/          utilitários, validações e formatação
  types/        os tipos da API
```

Feito por [Dayvison Resende](https://github.com/DayvisonResende).
