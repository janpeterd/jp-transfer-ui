import Download from '@/app/download/page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/download/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Download />;
}
