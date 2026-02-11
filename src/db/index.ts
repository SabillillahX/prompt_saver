import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema.ts'
import { createServerOnlyFn } from '@tanstack/react-start'

// export const db = drizzle(process.env.DATABASE_URL!, { schema })

const createDatabase = createServerOnlyFn(() =>
    drizzle(process.env.DATABASE_URL!, { schema })
);

export const db = createDatabase()
