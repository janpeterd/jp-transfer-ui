import AdminPage from '@/app/admin/page'; // Assuming Admin is the default export
// import LogIn from '@/app/login/page'; // No longer needed here if redirecting
import { getCurrentUser } from '@/api/users'; // Adjust path to your API function
import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname + location.search,
        },
        replace: true,
      });
    }

    try {
      const userData = await getCurrentUser();
      const userRole = userData?.data?.role;

      if (userRole !== 'ADMIN') {
        console.warn('User is not an admin, redirecting from /admin');
        toast.error("Not allowed")
        throw redirect({
          to: '/',
          replace: true,
        });
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'to' in error) {
        throw error;
      }

      console.error('Error fetching user data or unauthorized for admin route:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname + location.search,
        },
        replace: true,
      });
    }
  },
  component: AdminPageComponent,
});

function AdminPageComponent() {
  return <AdminPage />;
}
