import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FullScreenLoader } from '@/components/common/Loader';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const ArticlesPage = lazy(() =>
  import('@/pages/ArticlesPage').then((m) => ({ default: m.ArticlesPage })),
);
const ArticleDetailPage = lazy(() =>
  import('@/pages/ArticleDetailPage').then((m) => ({ default: m.ArticleDetailPage })),
);
const ArticleFormPage = lazy(() =>
  import('@/pages/ArticleFormPage').then((m) => ({ default: m.ArticleFormPage })),
);
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const SavedArticlesPage = lazy(() =>
  import('@/pages/SavedArticlesPage').then((m) => ({ default: m.SavedArticlesPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

export function App() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/artigos" element={<ArticlesPage />} />
          <Route path="/artigos/:id" element={<ArticleDetailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/artigos/novo" element={<ArticleFormPage />} />
            <Route path="/artigos/:id/editar" element={<ArticleFormPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/salvos" element={<SavedArticlesPage />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
