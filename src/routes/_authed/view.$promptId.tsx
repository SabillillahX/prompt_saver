import { Header } from '@/components/header'
import { Button } from '@/components/selia/button'
import { Heading } from '@/components/selia/heading'
import { Separator } from '@/components/selia/separator'
import { Text } from '@/components/selia/text'
import { viewPropmts } from '@/lib/api/create-prompt'
import { useDeleteStore } from '@/lib/utils/delete-stores'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeftIcon, PencilIcon, TrashIcon } from 'lucide-react'

export const Route = createFileRoute('/_authed/view/$promptId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const viewLoader = await viewPropmts({ data: { promptId: params.promptId } });

    if (!prompt) {
      throw notFound()
    }

    return { viewLoader }
  },
  notFoundComponent: () => {
    <div>
      Not Found Error. <Link to='/'>Back To Home</Link>
    </div>
  },
  errorComponent: () => <div>Error </div>
})

function RouteComponent() {
  const prompt = Route.useParams();
  const { viewLoader } = Route.useLoaderData();
  const setBeingDeleted = useDeleteStore(state => state.setBeingDeleted)

  return (
    <>
      <Header>
        <Heading>Prompt Details</Heading>
        <Button
          nativeButton={false}
          variant='outline'
          render={
            <Link to='/'>
              <ArrowLeftIcon /> Back
            </Link>
          }
        />
      </Header>
      <Separator className={'my-6'} />
      <Heading size={'sm'} level={2} className='text-dimmed'>
        Prompt Title
      </Heading>
      <Text className='text-2xl font-medium mb-8'>
        {viewLoader?.title}
      </Text>
      <Heading size={'sm'} level={2} className='text-dimmed'>
        Prompt Content
      </Heading>
      <Text className='text-2xl font-medium mb-10'>
        {viewLoader?.content}
      </Text>
      <Heading size={'sm'} level={2} className='text-dimmed'>
        Created At
      </Heading>
      <Text>
        {viewLoader?.createdAt.toLocaleDateString()}
      </Text>
      <Separator className={'my-8'} />
      <footer className='flex gap-2.5'>
        <Button
          nativeButton={false}
          variant={'outline'}
          block
          render={
            <Link
              to='/edit/$promptId'
              params={{
                promptId: prompt.promptId,
              }}
            >
              <PencilIcon /> Edit
            </Link>
          }
        >
        </Button>
        <Button
          nativeButton={false}
          variant={'danger'}
          block
          onClick={() => {
            if (viewLoader?.id && viewLoader?.title != null) {
              setBeingDeleted({
                id: viewLoader.id,
                title: viewLoader.title,
              });
            }
          }}
        >
          <TrashIcon /> Delete
        </Button>
      </footer>
    </>
  )
}
