import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

/**
 * Placeholder da Home (Fase 6). As telas reais fieis ao Figma
 * (hero, destaques, recentes, newsletter) sao construidas na Fase 8.
 */
export function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="font-mono text-2xl font-bold text-primary">&lt;M/&gt;</span>
      <h1 className="text-4xl font-bold">
        Explore o Futuro da <span className="text-primary">Tecnologia</span>
      </h1>
      <p className="text-muted-foreground">
        Fundacao do frontend pronta — Vite, React, TypeScript, Tailwind, shadcn/ui e tema
        claro/escuro. As telas completas chegam nas proximas fases.
      </p>
      <div className="flex items-center gap-3">
        <Button>Explorar Artigos</Button>
        <Button variant="outline">Comecar a Escrever</Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
