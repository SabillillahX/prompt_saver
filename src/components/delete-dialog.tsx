import { AlertDialog, AlertDialogBody, AlertDialogClose, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogPopup, AlertDialogTitle } from '@/components/selia/alert-dialog'
import { IconBox } from '@/components/selia/icon-box'
import { Strong } from '@/components/selia/text'
import { Trash2Icon } from 'lucide-react'
import { Button } from './selia/button'
import { useDeleteStore } from '@/lib/utils/delete-stores'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import z from 'zod'
import { useState } from 'react'
import { toastManager } from './selia/toast'
import { db } from '@/db'
import { promptsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect, useRouter } from '@tanstack/react-router'

const DeletePromptInputSchema = z.object({
    promptId: z.string().uuid()
})

export const deletePrompt = createServerFn({ method: 'POST' })
    .inputValidator(DeletePromptInputSchema)
    .handler(async ({ data }) => {
        await db.delete(promptsTable).where(eq(promptsTable.id, data.promptId));
        throw redirect({
            to: '/'
        })
    })

export function DeleteDialog() {
    const deletePromptFn = useServerFn(deletePrompt);
    const beingDeleted = useDeleteStore(state => state.beingDeleted);
    const setBeingDeleted = useDeleteStore(state => state.setBeingDeleted);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!beingDeleted?.id) return;

        try {
            setLoading(true);
            await deletePromptFn({
                data: {
                    promptId: String(beingDeleted?.id)
                }
            });
            toastManager.add({
                title: 'Prompt Deleted',
                description: 'Prompt deleted successfully',
                type: 'success'
            });
            router.invalidate();
        } catch {
            toastManager.add({
                title: 'Error',
                description: 'Failed to delete prompt. Please try again.',
                type: 'error'
            })
        } finally {
            setLoading(false);
            setBeingDeleted(null);
        }
    }

    return (
        <AlertDialog open={!!beingDeleted} onOpenChange={() => setBeingDeleted(null)}>
            <AlertDialogPopup>
                <AlertDialogHeader>
                    <IconBox variant={'danger'}>
                        <Trash2Icon />
                    </IconBox>
                    <AlertDialogTitle>Delete prompt</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogBody>
                    <AlertDialogDescription>
                        Are sure to delete "<Strong>{beingDeleted?.title}</Strong>"?
                    </AlertDialogDescription>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <AlertDialogClose>Cancel</AlertDialogClose>
                    <Button
                        variant={'danger'}
                        onClick={handleDelete}
                        progress={loading}
                    >Delete</Button>
                </AlertDialogFooter>
            </AlertDialogPopup>
        </AlertDialog>
    )
}