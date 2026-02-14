import { Header } from '@/components/header'
import { PromptForm } from '@/components/prompt-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/selia/alert'
import { Button } from '@/components/selia/button'
import { Heading } from '@/components/selia/heading'
import { Separator } from '@/components/selia/separator'
import { editPrompts, updatePromptFromServerFn } from '@/lib/api/create-prompt'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { ArrowLeftIcon, XCircleIcon } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_authed/edit/$promptId')({
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
