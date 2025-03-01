import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { ErrorComponent, RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from "@/routeTree.gen";
import Spinner from "@/components/Spinner";
// Render the app
const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    auth: undefined!, // We'll inject this when we render
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
