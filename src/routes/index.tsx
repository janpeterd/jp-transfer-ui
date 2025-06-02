import App from '@/App';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        replace: true,
      });
    }
  },
  component: App,
});
