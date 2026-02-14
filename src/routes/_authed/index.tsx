import { Button } from '@/components/selia/button'
import { Heading } from '@/components/selia/heading'
import { Item, ItemAction, ItemContent, ItemDescription, ItemTitle } from '@/components/selia/item'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@/components/selia/menu'
import { Separator } from '@/components/selia/separator'
import { Stack } from '@/components/selia/stack'
import { createFileRoute, Link } from '@tanstack/react-router'
import { EllipsisVerticalIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { Header } from '@/components/header'
import { useDeleteStore } from '@/lib/utils/delete-stores'
import { zodValidator } from '@tanstack/zod-adapter'
import { PromptSearch } from '@/components/prompt-search'
import { getPrompts, PromptsSearchSchema } from '@/lib/api/list-prompt'

export const Route = createFileRoute('/_authed/')({
  component: App,
  validateSearch: zodValidator(PromptsSearchSchema),
  loaderDeps: ({ search }) => ({ query: search.query }),
  loader: async ({ deps }) => {
    const prompts = await getPrompts({
      data: {
        query: deps.query
      }
    });

    return { prompts };
  }
});

function App() {
  const user = Route.useRouteContext();
  console.log(user)
  const setBeingDeleted = useDeleteStore(state => state.setBeingDeleted);
  const { prompts } = Route.useLoaderData();

  return (
    <>
      <Header>
        <Heading>
          Prompt Saver
        </Heading>
        <Button
          nativeButton={false}
          variant={'outline'}
          render={
            <Link to="/create" >
              <PlusIcon /> Create Prompt
            </Link>
          } />
      </Header>
      <Separator className="my-6" />

      {/* Search bar */}
      <PromptSearch />

      {/* Main list */}
      <Stack>
        {prompts.map((prompts) => (
          <Item key={prompts.id}>
            <ItemContent>
              <ItemTitle>{prompts.title}</ItemTitle>
              <ItemDescription>
                {prompts.content.length > 100
                  ? prompts.content.slice(0, 100) + '...'
                  : prompts.content
                }
              </ItemDescription>
            </ItemContent>
            <ItemAction>
              <Button
                variant={'outline'}
                nativeButton={false}
                size={'sm'}
                render={
                  <Link
                    to='/view/$promptId'
                    params={{
                      promptId: String(prompts.id),
                    }}>
                    View
                  </Link>
                }
              />
              <Menu>
                <MenuTrigger
                  render={
                    <Button variant={'outline'} size={'sm-icon'}>
                      <EllipsisVerticalIcon />
                    </Button>
                  }
                />
                <MenuPopup>
                  <MenuItem
                    nativeButton={false}
                    render={
                      <Link
                        to='/edit/$promptId'
                        params={{
                          promptId: String(prompts.id)
                        }}
                      >
                        <PencilIcon /> Edit
                      </Link>
                    }
                  >
                  </MenuItem>
                  <MenuItem
                    className={'text-danger'}
                    onClick={() =>
                      setBeingDeleted({
                        id: prompts.id,
                        title: prompts.title
                      })
                    }
                  >
                    <Trash2Icon className='text-danger' /> Delete
                  </MenuItem>
                </MenuPopup>
              </Menu>
            </ItemAction>
          </Item>
        ))}
      </Stack>
    </>
  )
}
