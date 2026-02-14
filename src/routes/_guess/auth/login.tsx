import { Alert, AlertDescription, AlertTitle } from '@/components/selia/alert';
import { Button } from '@/components/selia/button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/selia/card';
import { Field, FieldError, FieldLabel } from '@/components/selia/field';
import { Form } from '@/components/selia/form';
import { Input } from '@/components/selia/input';
import { Text, TextLink } from '@/components/selia/text';
import { loginServerFn } from '@/lib/api/auth';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start';
import { XCircleIcon } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_guess/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const loginFn = useServerFn(loginServerFn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setError(null);

    try {
      setLoading(true);
      const loginRes = await loginFn({
        data: {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        }
      });

      if (loginRes.error) {
        setError(loginRes.error);
        return;
      }
    } catch (error) {
      setError("Failed to login. Please try again")
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full lg:w-5/12 xl:w-md">
      <CardHeader align="center">
        <CardTitle>Login to your account</CardTitle>
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
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              name='email'
              placeholder="Enter your email"
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
              name='password'
              placeholder="Enter your password"
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
            Sign In
          </Button>
        </Form>
        <Text className='text-center'>
          Don't have an account? <TextLink render={<Link to='/auth/register'>Sign up</Link>} />
        </Text>
      </CardBody>
    </Card>
  )
}
