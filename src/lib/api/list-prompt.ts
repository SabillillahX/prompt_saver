import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, ilike, or } from 'drizzle-orm'
import { promptsTable } from '@/db/schema'
import z from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware'

const GetPromptsInputSchema = z.object({
    query: z.string().optional()
})

export const PromptsSearchSchema = z.object({
    query: z.string().optional()
})

export const getPrompts = createServerFn({ method: 'GET' })
    .middleware([authMiddleware])
    .inputValidator(GetPromptsInputSchema)
    .handler(async ({ data, context }) => {
        const { user } = context

        const promptLoader = await db.query.promptsTable.findMany({
            where: and(
                eq(promptsTable.userId, user.id),
                data.query
                    ? or(
                        ilike(promptsTable.title, `%${data.query}%`),
                        ilike(promptsTable.content, `%${data.query}%`)
                    )
                    : undefined,
            ),
            orderBy: [desc(promptsTable.createdAt)]
        });
        return promptLoader
    });