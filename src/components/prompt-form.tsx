import { Button } from '@/components/selia/button'
import { Field, FieldControl, FieldError, FieldLabel } from '@/components/selia/field'
import { Form } from '@/components/selia/form'
import { Input } from '@/components/selia/input'
import { Textarea } from '@/components/selia/textarea'
import { useEffect, useState } from 'react'

export function PromptForm(
    {
        Loading,
        onSubmit,
        data
    }: React.ComponentProps<typeof Form> & {
        Loading?: boolean;
        data?: {
            title?: string;
            content?: string;
        };
    }) {
    const [titleValue, setTitleValue] = useState('');
    const [contentValue, setContentValue] = useState('');

    useEffect(() => {
        setTitleValue(data?.title || '');
        setContentValue(data?.content || '');
    }, [data]);

    return (
        <Form onSubmit={onSubmit}>
            <Field>
                <FieldLabel htmlFor='title'>Prompt Title</FieldLabel>
                <Input
                    id='title'
                    name='title'
                    placeholder='Enter prompt title'
                    required
                    value={titleValue}
                    onChange={e => setTitleValue(e.target.value)}
                />
                <FieldError match='valueMissing'>
                    Title is required!
                </FieldError>
            </Field>
            <Field>
                <FieldLabel htmlFor='content'>Content Prompt</FieldLabel>
                <FieldControl
                    render={
                        <Textarea
                            id='content'
                            name='content'
                            placeholder='Enter the prompt content'
                            required
                            value={contentValue}
                            onChange={e => setContentValue(e.target.value)}
                        />
                    }
                />
                <FieldError match='valueMissing'>
                    Content prompt is required!
                </FieldError>
            </Field>
            <Button type='submit' progress={Loading}>
                {data?.title ? 'Update Prompt' : 'Create Prompt'}
            </Button>
        </Form>
    )
}