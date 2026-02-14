import { createMiddleware } from "@tanstack/react-start";
import { getCurrentUser } from "../api/auth";

export const authMiddleware = createMiddleware()
    .server(async ({ next }) => {
        const user = await getCurrentUser()


        if (!user) {
            console.error("Unauthorized");
            throw new Error("Unauthorized");
        }

        return next({
            context: { user },
        });
    });