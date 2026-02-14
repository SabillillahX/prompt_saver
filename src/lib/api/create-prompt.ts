import { z } from 'zod'
import { db } from '@/db'
import { promptsTable } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
import { authMiddleware } from '../middlewares/auth-middleware'

{/* Create prompt method: POST */ }
const PromptInputSchema = z.object({
    title: z.string().min(1).max(50),
    content: z.string().min(1)
})

export const createPromptServerFn = createServerFn({ method: 'POST' })
    .middleware([authMiddleware])
    .inputValidator(PromptInputSchema)
    .handler(async ({ data, context }) => {
        const { user } = context;

        await db.insert(promptsTable).values({
            title: data.title,
            content: data.content,
            userId: user.id
        });

        throw redirect({
            to: '/'
        });
    })

{/* Edit prompt method: GET & UPDATE */ }
// Get the data
const GetPromptsFromSchema = z.object({
    promptId: z.string().uuid()
})

export const editPrompts = createServerFn({ method: 'GET' })
    .inputValidator(GetPromptsFromSchema)
    .handler(async ({ data }) => {
        const editPromptLoader = await db.query.promptsTable.findFirst({
            where: eq(promptsTable.id, data.promptId),
        })

        return editPromptLoader;
    })

// Modify the data
const UpdatePromptFromServer = z.object({
    promptId: z.string().uuid(),
    title: z.string().min(1).max(50),
    content: z.string().min(1)
})

export const updatePromptFromServerFn = createServerFn({ method: 'POST' })
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
            to: '/view/$promptId',
            params: {
                promptId: data.promptId
            }
        });
    })

{/* View prompt method: GET */ }
const GetInputFromSchema = z.object({
    promptId: z.string().uuid()
})

export const viewPropmts = createServerFn({ method: 'GET' })
    .inputValidator(GetInputFromSchema)
    .handler(async ({ data }) => {
        const viewPromptLoader = await db.query.promptsTable.findFirst({
            where: eq(promptsTable.id, data.promptId)
        });
        return viewPromptLoader;
    })