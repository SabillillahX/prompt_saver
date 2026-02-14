import { Header } from '@/components/header'
import { PromptForm } from '@/components/prompt-form'
import { Button } from '@/components/selia/button'
import { Heading } from '@/components/selia/heading'
import { Separator } from '@/components/selia/separator'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { ArrowLeftIcon, XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/selia/alert'
import { createPromptServerFn } from '@/lib/api/create-prompt'

export const Route = createFileRoute('/_authed/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const createPromptFn = useServerFn(createPromptServerFn);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setError(null);
    
    try {
      setLoading(true);
      await createPromptFn({
        data: {
          title: formData.get('title') as string,
          content: formData.get('content') as string
        }
      });
    } catch (error) {
      setError("Failed to create prompt. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header>
        <Heading>Create Propmt</Heading>
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
      <PromptForm onSubmit={handleSubmit} Loading={loading} />
    </>
  )
}
