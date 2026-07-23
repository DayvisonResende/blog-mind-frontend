import { useEffect } from 'react';

const BASE_TITLE = 'Blog Mind';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE_TITLE}` : BASE_TITLE;
  }, [title]);
}
