import { Header } from '@/components/header'
import { Button } from '@/components/selia/button'
import { Heading } from '@/components/selia/heading'
import { Separator } from '@/components/selia/separator'
import { Text } from '@/components/selia/text'
import { db } from '@/db'
import { promptsTable } from '@/db/schema'
import { useDeleteStore } from '@/stores/delete-stores'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { ArrowLeftIcon, PencilIcon, TrashIcon } from 'lucide-react'
import z from 'zod'

const GetInputFromSchema = z.object({
  promptId: z.uuid()
})

const viewPropmts = createServerFn({ method: 'GET' })
  .inputValidator(GetInputFromSchema)
  .handler(async ({ data }) => {
    const viewPromptLoader = await db.query.promptsTable.findFirst({
      where: eq(promptsTable.id, data.promptId)
    });
    return viewPromptLoader;
  })

export const Route = createFileRoute('/ui/view/$promptId')({
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
              to='/ui/edit/$promptId'
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
