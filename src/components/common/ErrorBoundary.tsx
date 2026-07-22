import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Em producao, aqui iria um servico de monitoramento (ex.: Sentry).
    console.error('[ErrorBoundary]', error);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-bold">Algo deu errado</h1>
          <p className="text-muted-foreground">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <Button onClick={this.handleReload}>Recarregar</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
