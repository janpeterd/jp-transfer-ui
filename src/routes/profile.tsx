import { createFileRoute } from '@tanstack/react-router'
import LogIn from '@/app/login/page'
import { useAuth } from '@/hooks/useAuth';
import Profile from '@/app/profile/page';

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const isAuthenticated = useAuth(); // You can use the custom hook here too

  return isAuthenticated ? <Profile /> : <LogIn />;  // Only render App if authenticated
}
