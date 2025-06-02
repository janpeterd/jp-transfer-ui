import BottomGradient from '@/components/BottomGradient'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Providers from '@/providers/Provider'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: () =>
  (
    <div>
      <Providers>
        <div className="relative p-0 mb-12">
          <Navbar />
        </div>

        <main className="dark relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
          <Outlet />
          <Footer />
        </main>
        <div className="absolute inset-0 -z-10">
          <BottomGradient />
        </div>
        <Toaster richColors={true} />
      </Providers>
    </div>
  ),
})
