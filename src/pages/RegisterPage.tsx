import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { registerSchema, type RegisterForm } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { NormalizedError } from '@/services/api';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';

export function RegisterPage() {
  useDocumentTitle('Criar conta');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema), mode: 'onTouched' });

  // Feedback ao vivo da confirmacao de senha.
  const password = useWatch({ control, name: 'password' });
  const confirmPassword = useWatch({ control, name: 'confirmPassword' });
  const passwordsMatch = Boolean(confirmPassword) && password === confirmPassword;

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error((error as NormalizedError).message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Logo className="text-4xl" />
        <h1 className="text-3xl font-bold">Cadastre-se na Plataforma</h1>
        <p className="text-muted-foreground">Crie sua conta para gerenciar seus artigos</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-lg border bg-card p-8"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input id="name" placeholder="John Doe" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="exemplo@email.com" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <PasswordInput id="password" placeholder="********" {...register('password')} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="********"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword ? (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          ) : passwordsMatch ? (
            <p className="flex items-center gap-1 text-sm text-emerald-500">
              <CheckCircle2 className="size-4" /> As senhas coincidem
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <Users className="mr-2 size-4" />
          {isSubmitting ? 'Criando...' : 'Criar conta'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}
