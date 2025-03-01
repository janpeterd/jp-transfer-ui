import { createRootRoute, Outlet } from '@tanstack/react-router'
import BottomGradient from '@/components/BottomGradient'
import { Toaster } from 'sonner'
import Providers from '@/providers/Provider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const Route = createRootRoute({
  component: () =>
  (
    <>
      <Providers>
        <div className="absolute top-0 left-0 p-4 z-10 w-full">
          <Navbar />
        </div>

        <main className="dark relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
          <Outlet />
          <Footer />
        </main>
        <div className="absolute inset-0 z-0">
          <BottomGradient />
        </div>
        <Toaster richColors={true} />
      </Providers>
    </>
  ),
})
