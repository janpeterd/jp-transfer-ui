import Profile from '@/app/profile/page';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/profile')({
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
  component: Profile,
})
