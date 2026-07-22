import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { authService } from '@/services/auth.service';
import { TOKEN_STORAGE_KEY } from '@/services/api';
import type { User } from '@/types/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Comeca carregando apenas se houver um token para restaurar.
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
  );

  // Ao montar: se houver token salvo, restaura a sessao buscando /auth/me.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return;

    authService
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_STORAGE_KEY))
      .finally(() => setLoading(false));
  }, []);

  const persistSession = useCallback((token: string, loggedUser: User) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setUser(loggedUser);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { token, user: loggedUser } = await authService.login({ email, password });
      persistSession(token, loggedUser);
    },
    [persistSession],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { token, user: newUser } = await authService.register({ name, email, password });
      persistSession(token, newUser);
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updated: User) => setUser(updated), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
