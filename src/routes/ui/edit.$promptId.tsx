import { Header } from '@/components/header'
import { PromptForm } from '@/components/prompt-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/selia/alert'
import { Button } from '@/components/selia/button'
import { Heading } from '@/components/selia/heading'
import { Separator } from '@/components/selia/separator'
import { db } from '@/db'
import { promptsTable } from '@/db/schema'
import { createFileRoute, Link, notFound, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { ArrowLeftIcon, XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import z from 'zod'

// GET
const GetPromptsFromSchema = z.object({
  promptId: z.string().uuid()
})

// UPDATE
const UpdatePromptFromServer = z.object({
  promptId: z.uuid(),
  title: z.string().min(1).max(50),
  content: z.string().min(1)
})

const editPrompts = createServerFn({ method: 'GET' })
  .inputValidator(GetPromptsFromSchema)
  .handler(async ({ data }) => {
    const editPromptLoader = await db.query.promptsTable.findFirst({
      where: eq(promptsTable.id, data.promptId),
    })

    return editPromptLoader;
  })

const updatePromptFromServerFn = createServerFn({ method: 'POST' })
  .inputValidator(UpdatePromptFromServer)
  .handler(async ({ data }) => {
    await db
      .update(promptsTable)
      .set({
        title: data.title,
        content: data.content
      })
      .where(eq(promptsTable.id, data.promptId));

    throw redirect({
      to: '/ui/view/$promptId',
      params: {
        promptId: data.promptId
      }
    });
  })

export const Route = createFileRoute('/ui/edit/$promptId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const editLoader = await editPrompts({ data: { promptId: params.promptId } })

    if (!editLoader) {
      throw notFound();
    }

    return { editLoader };
  },
  notFoundComponent: () => {
    <div>
      Not Found Error. <Link to='/'>Back To Home</Link>
    </div>
  },
  errorComponent: () => <div>Error </div>
})

function RouteComponent() {
  const { editLoader } = Route.useLoaderData();
  const params = Route.useParams();
  const updateServerFn = useServerFn(updatePromptFromServerFn)
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setError(null);

    try {
      setLoading(true);
      await updateServerFn({
        data: {
          title: formData.get('title') as string,
          content: formData.get('content') as string,
          promptId: params.promptId,
        }
      })
    } catch (error) {
      setError("Failed to update prompt. Please try again later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header>
        <Heading>Edit Propmt {editLoader?.title}</Heading>
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
      {error && (
        <Alert variant={'danger'} className='mb-6'>
          <XCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <PromptForm
        onSubmit={handleSubmit}
        Loading={loading}
        data={{
          title: editLoader?.title,
          content: editLoader?.content
        }}
      />
    </>
  )
}
