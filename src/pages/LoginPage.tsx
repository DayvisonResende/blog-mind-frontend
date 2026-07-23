import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema, type LoginForm } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { NormalizedError } from '@/services/api';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
  useDocumentTitle('Entrar');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast.success('Bem-vindo de volta!');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error((error as NormalizedError).message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Logo className="text-4xl" />
        <h1 className="text-3xl font-bold">Entrar na Plataforma</h1>
        <p className="text-muted-foreground">Acesse sua conta para gerenciar seus artigos</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-lg border bg-card p-8"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="exemplo@email.com" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <span className="text-xs text-muted-foreground">Esqueceu a senha?</span>
          </div>
          <PasswordInput id="password" placeholder="********" {...register('password')} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <LogIn className="mr-2 size-4" />
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="font-medium text-foreground hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}
