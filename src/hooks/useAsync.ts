import { useEffect, useState } from 'react';
import type { NormalizedError } from '@/services/api';

interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: NormalizedError | undefined;
}

/**
 * Executa uma funcao assincrona e expoe { data, loading, error }.
 * Reexecuta quando o array `deps` muda. Ignora respostas obsoletas
 * (evita setState apos desmontar / troca de deps).
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: undefined,
    loading: true,
    error: undefined,
  });

  useEffect(() => {
    let active = true;
    setState({ data: undefined, loading: true, error: undefined });
    fn()
      .then((data) => active && setState({ data, loading: false, error: undefined }))
      .catch(
        (error) => active && setState({ data: undefined, loading: false, error: error as NormalizedError }),
      );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
