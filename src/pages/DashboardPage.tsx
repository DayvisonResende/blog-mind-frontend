import { useAuth } from '@/hooks/useAuth';

/** Placeholder do Dashboard (Fase 8: estatisticas, meus artigos, atividade recente). */
export function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Bem-vindo de volta, {user?.name}!</p>
      <p className="mt-4 text-sm text-muted-foreground">
        Estatisticas, seus artigos e atividade recente chegam na Fase 8.
      </p>
    </div>
  );
}
