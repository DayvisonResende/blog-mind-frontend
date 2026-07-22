import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * Placeholder da Home (Fases 6-7). As telas reais fieis ao Figma
 * (hero, destaques, recentes, newsletter) sao construidas na Fase 8.
 */
export function HomePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">
        Explore o Futuro da <span className="text-primary">Tecnologia</span>
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Artigos sobre IA, desenvolvimento, DevOps e as ultimas tendencias tecnologicas.
      </p>
      <div className="flex items-center gap-3">
        <Button asChild>
          <Link to="/artigos">Explorar Artigos</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/cadastro">Comecar a Escrever</Link>
        </Button>
      </div>
    </div>
  );
}
