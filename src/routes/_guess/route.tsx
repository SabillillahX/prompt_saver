import { getCurrentUser } from '@/lib/api/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_guess')({
  beforeLoad: async () => {
    const user = await getCurrentUser();

    if (user) {
      throw redirect({
        to: '/'
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
