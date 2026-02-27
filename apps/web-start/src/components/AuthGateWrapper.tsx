import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from '@tanstack/react-router';

export default function AuthGateWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth0();
  const { pathname } = useLocation();

  const publicRoutes = ['/', '/join'];

  if (publicRoutes.includes(pathname)) {
    return children;
  }

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated)
    return (
      <div className="w-full flex flex-col items-center justify-center mt-20">
        <h2 className="text-2xl mb-4">Please log in to access this page.</h2>
      </div>
    );
  return children;
}
