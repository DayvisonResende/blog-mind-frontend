import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-5xl font-bold text-primary">404</h1>
      <p className="text-muted-foreground">A pagina que voce procura nao foi encontrada.</p>
      <Button asChild>
        <Link to="/">Voltar para a Home</Link>
      </Button>
    </div>
  );
}
