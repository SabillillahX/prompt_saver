import { db } from "@/db";
import { userTable } from "@/db/schema";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { eq, or } from "drizzle-orm";
import z from "zod";
import bcrypt from 'bcryptjs'
import { useAppSession } from "../utils/session";

{/* Register method: POST */ }
const SignUpInputSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
})

export const registerServerFn = createServerFn({ method: 'POST' })
    .inputValidator(SignUpInputSchema)
    .handler(async ({ data }) => {
        const existingEmailUsername = await db.query.userTable.findFirst({
            where: or(
                eq(userTable.email, data.email),
                eq(userTable.name, data.name)
            )
        });

        if (existingEmailUsername) {
            if (existingEmailUsername.email === data.email) {
                return { error: "Email is already exist." }
            }

            if (existingEmailUsername.name === data.name) {
                return { error: "Username is already exist." }
            }

            return { error: "Account is already exist." }
        }

        const hanshedPassword = await bcrypt.hash(data.password, 12)

        // Create user
        const [newUser] = await db.insert(userTable).values({
            name: data.name,
            email: data.email,
            password: hanshedPassword
        })
            .returning();

        const session = await useAppSession();
        await session.update({
            userId: newUser.id
        });

        throw redirect({
            to: '/'
        });
    });

{/* Fetch current User */ }
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
    async () => {
        const session = await useAppSession();
        const userId = session.data.userId;

        if (!userId) {
            return null
        }

        const user = await db.query.userTable.findFirst({
            where: eq(userTable.id, userId)
        });

        return user
    }
)

{/* Authentication user */ }
const authenticate = createServerOnlyFn(
    async (email: string, password: string) => {
        const user = await db.query.userTable.findFirst({
            where: eq(userTable.email, email)
        });

        if (!user) {
            return null
        }

        const isValid = await bcrypt.compare(password, user.password);

        return isValid ? user : null;
    }
);

{/* Login method: POST */ }
const SignInInputSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export const loginServerFn = createServerFn({ method: 'POST' })
    .inputValidator(SignInInputSchema)
    .handler(async ({ data }) => {
        const authUser = await authenticate(data.email, data.password);

        if (!authUser) {
            return { error: "Invalid email or password" }
        };

        const session = await useAppSession();
        await session.update({
            userId: authUser.id
        })

        throw redirect({
            to: '/'
        })
    })

{/* Logout method: POST */ }
export const logoutServerFn = createServerFn({ method: 'POST' })
    .handler(async () => {
        const session = await useAppSession();
        await session.clear();

        throw redirect({
            to: '/auth/login'
        })
    })
