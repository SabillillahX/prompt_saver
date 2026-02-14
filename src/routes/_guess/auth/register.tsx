import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/selia/button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/selia/card';
import { Field, FieldError, FieldLabel } from '@/components/selia/field';
import { Input } from '@/components/selia/input';
import { Text, TextLink } from '@/components/selia/text';
import { Form } from '@/components/selia/form';
import { useServerFn } from '@tanstack/react-start';
import { registerServerFn } from '@/lib/api/auth';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/selia/alert';
import { XCircleIcon } from 'lucide-react';

export const Route = createFileRoute('/_guess/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const registerFn = useServerFn(registerServerFn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget;
    const formData = new FormData(form);

    setError(null);

    try {
      setLoading(true);
      const registerRes = await registerFn({
        data: {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        }
      });

      if (registerRes.error) {
        setError(registerRes.error);
        return;
      }
      
    } catch (error) {
      setError('Failed to create an account. Please try again')
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full lg:w-5/12 xl:w-md">
      <CardHeader align="center">
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col gap-5">
        {error && (
          <Alert variant={'danger'} className='mb-6'>
            <XCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="name"
              placeholder="Enter your name"
              name='name'
              required />
            <FieldError match='valueMissing'>
              Name is required
            </FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              name='email'
              required />
            <FieldError match='valueMissing'>
              Email is required
            </FieldError>
            <FieldError match='typeMismatch'>
              Invalid email address
            </FieldError>
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <TextLink href="#" className="ml-auto">
                Forgot password?
              </TextLink>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              name='password'
              required
            />
            <FieldError match='valueMissing'>
              Password is required
            </FieldError>
          </Field>
          <Button
            variant="primary"
            block
            size="lg"
            type='submit'
            progress={loading}
          >
            Sign up
          </Button>
        </Form>
        <Text className='text-center'>
          Already have an account? <TextLink render={<Link to='/auth/login'>Login</Link>} />
        </Text>
      </CardBody>
    </Card>
  )
}
