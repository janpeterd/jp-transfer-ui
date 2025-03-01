import { createFileRoute } from '@tanstack/react-router'
import LogIn from '@/app/login/page'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LogIn />
}
