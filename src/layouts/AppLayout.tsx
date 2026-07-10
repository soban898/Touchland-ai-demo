import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AppSidebar } from '@/components/AppSidebar'
import { TopNavbar } from '@/components/TopNavbar'
import { AICopilot } from '@/components/AICopilot'
import { CommandPalette } from '@/components/CommandPalette'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

export function AppLayout() {
  const [commandOpen, setCommandOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <TopNavbar onCommandOpen={() => setCommandOpen(true)} />
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="container mx-auto px-6 py-6 max-w-[1600px]">
                <Outlet />
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
      <AICopilot />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <Toaster position="bottom-right" />
    </SidebarProvider>
  )
}
