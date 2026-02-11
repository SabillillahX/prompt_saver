import { Button } from '@/components/selia/button'
import { Heading } from '@/components/selia/heading'
import { Item, ItemAction, ItemContent, ItemDescription, ItemTitle } from '@/components/selia/item'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@/components/selia/menu'
import { Separator } from '@/components/selia/separator'
import { Stack } from '@/components/selia/stack'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { EllipsisVerticalIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from 'lucide-react'
import { Header } from '@/components/header'
import { useDeleteStore } from '@/stores/delete-stores'
import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'
import { desc, ilike, or } from 'drizzle-orm'
import { promptsTable } from '@/db/schema'
import { InputGroup, InputGroupAddon } from '@/components/selia/input-group'
import { Input } from '@/components/selia/input'
import z from 'zod'
import { Text } from '@/components/selia/text'
import {zodValidator} from '@tanstack/zod-adapter'

const GetPromptsInputSchema = z.object({
  query: z.string().optional()
})

const PromptsSearchSchema = z.object({
  query: z.string().optional()
})

const getPrompts = createServerFn({ method: 'GET' })
  .inputValidator(GetPromptsInputSchema)
  .handler(async ({ data }) => {
    const promptLoader = await db.query.promptsTable.findMany({
      where: data.query
        ? or(
          ilike(promptsTable.title, `%${data.query}%`),
          ilike(promptsTable.content, `%${data.query}%`)
        )
        : undefined,
      orderBy: [desc(promptsTable.createdAt)]
    });
    return promptLoader
  });

export const Route = createFileRoute('/')({
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
  const setBeingDeleted = useDeleteStore(state => state.setBeingDeleted);
  const { prompts } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = event.currentTarget.query.value;
    navigate({
      to: '/',
      search: {
        query
      }
    });
  }

  return (
    <>
      <Header>
        <Heading>
          The Joker
        </Heading>
        <Button
          nativeButton={false}
          variant={'outline'}
          render={
            <Link to="/ui/create" >
              <PlusIcon /> Create Prompt
            </Link>
          } />
      </Header>
      <Separator className="my-6" />

      {/* Search Bar */}
      <form className='mb-6' onSubmit={handleSearch}>
        <InputGroup>
          <Input placeholder='Search prompt...' name='query' />
          <InputGroupAddon align='end'>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        {search.query && (
          <Text className='text-muted-foreground mt-2'>
            Result for '{search.query}'. 
            <Link 
              to='/'
              search={{
                query: undefined
              }}
              className='underline'
            >
              Clear search
            </Link>
          </Text>
        )}
      </form>

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
                    to='/ui/view/$promptId'
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
                        to='/ui/edit/$promptId'
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
