import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Rola a pagina para o topo a cada troca de rota. */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
