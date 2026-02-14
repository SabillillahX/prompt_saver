import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getCurrentUser, logoutServerFn } from '@/lib/api/auth'
import { Text } from '@/components/selia/text';
import { Button } from '@/components/selia/button';
import { Separator } from '@/components/selia/separator';
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const user = await getCurrentUser();

    if (!user) {
      throw redirect({
        to: '/auth/login'
      })
    }

    return { user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const logout = useServerFn(logoutServerFn)
  const { user } = Route.useRouteContext();

  return (
    <nav>
      <nav className='flex justify-between items-center'>
        <div className='font-semibold'>Kocak</div>
        <div className='flex items-center gap-2'>
          <Text>Hallo! {user.name}</Text>
          <Button variant={'danger'} onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </nav>
      <Separator className={'my-6'} />
      <Outlet />
    </nav>
  )
}
