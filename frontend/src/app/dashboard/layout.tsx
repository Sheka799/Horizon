import { AppSidebar, SiteHeader } from "@/shared/components"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)'
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col min-w-0 overflow-hidden'>
          <div className='@container/main flex flex-1 flex-col min-w-0'>
            <div className='flex flex-1 flex-col p-4 md:p-6 min-w-0'>
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}