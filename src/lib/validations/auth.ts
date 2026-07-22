import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail').email('E-mail invalido'),
  password: z.string().min(1, 'Informe sua senha'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres').max(120),
    email: z.string().min(1, 'Informe seu e-mail').email('E-mail invalido'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas nao coincidem',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres').max(120),
  bio: z.string().max(500, 'Bio deve ter no maximo 500 caracteres'),
  avatar: z
    .string()
    .trim()
    .max(500)
    .url('URL invalida')
    .or(z.literal(''))
    .transform((v) => v || ''),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;
