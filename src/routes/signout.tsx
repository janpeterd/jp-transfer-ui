import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/signout')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
  }, [])
  return <div>Signing out...</div>
}
