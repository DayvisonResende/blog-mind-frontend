import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().trim().min(3, 'Titulo deve ter ao menos 3 caracteres').max(200),
  summary: z.string().trim().min(3, 'Resumo deve ter ao menos 3 caracteres').max(120),
  category: z.string().trim().min(1, 'Selecione ou informe uma categoria').max(80),
  content: z.string().trim().min(1, 'Conteudo e obrigatorio').max(8000),
});

export type ArticleForm = z.infer<typeof articleSchema>;
