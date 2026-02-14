import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { InputGroup, InputGroupAddon } from "./selia/input-group";
import { Input } from "./selia/input";
import { SearchIcon } from "lucide-react";
import { Text } from "./selia/text";
import { useEffect, useState } from "react";

const Route = getRouteApi('/_authed/');

export function PromptSearch() {
    const search = Route.useSearch();
    const navigate = useNavigate();

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(search.query || "");
    }, [search.query]);

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
        <form className='mb-6' onSubmit={handleSearch}>
            <InputGroup>
                <Input
                    placeholder='Search prompt...'
                    name='query'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
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
    )
}