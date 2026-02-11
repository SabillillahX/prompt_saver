import { Button } from '@/components/selia/button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/selia/card';
import { Field, FieldError, FieldLabel } from '@/components/selia/field';
import { Form } from '@/components/selia/form';
import { Input } from '@/components/selia/input';
import { Text, TextLink } from '@/components/selia/text';
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const formData = new FormData(form);

    console.log(formData.get("email"), formData.get("password"))
  }

  return (
    <Card className="w-full lg:w-5/12 xl:w-md">
      <CardHeader align="center">
        <CardTitle>Login to your account</CardTitle>
      </CardHeader>
      <CardBody className="flex flex-col gap-5">
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
