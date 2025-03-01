import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth'; // Your custom hook
import App from '@/App';
import LogIn from '@/app/login/page';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const isAuthenticated = useAuth(); // You can use the custom hook here too

  return isAuthenticated ? <App /> : <LogIn />;  // Only render App if authenticated
}
