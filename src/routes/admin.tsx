import Admin from '@/app/admin/page';
import { useAdmin } from '@/hooks/useAdmin'
import { createFileRoute } from '@tanstack/react-router'
import LogIn from '@/app/login/page';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const isAdmin = useAdmin()
  return isAdmin ? <Admin /> : <LogIn />;
}
