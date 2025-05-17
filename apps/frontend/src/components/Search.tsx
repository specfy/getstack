import { Link, useNavigate } from '@tanstack/react-router';
import { useMemo, useRef, useState } from 'react';
import { useKey } from 'react-use';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { categories, listCategories, listTech } from '@/lib/stack';
import { cn } from '@/lib/utils';

export const Search: React.FC<{
  inline?: boolean;
  children?: JSX.Element;
  onPick: () => void;
}> = ({ inline, onPick }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useKey(
    'Escape',
    () => {
      if (inline && search === '') {
        inputRef.current?.blur();
      }
      setSearch('');
    },
    {},
    [search]
  );

  const cats = useMemo(() => {
    const val = search;
    const loc = val.toLocaleLowerCase();
    return listCategories.filter((v) => v.name.includes(val) || v.keyword.includes(loc));
  }, [search]);
  const technologies = useMemo(() => {
    const val = search;
    return listTech
      .filter((v) => v.name.includes(val) || v.key.includes(val) || v.type.includes(val))
      .slice(0, 50);
  }, [search]);

  const showList = !inline || isFocused || search.trim().length > 0;

  return (
    <div className={cn(inline && 'relative w-full max-w-md')}>
      <Command shouldFilter={false} className="w-full">
        <CommandInput
          ref={inputRef}
          placeholder="Search for category or technology..."
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 100);
          }}
        />
        {showList && (
          <CommandEmpty
            className={cn(
              'text-xs italic text-gray-500 px-4 py-2',
              inline &&
                'absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-white shadow-md'
            )}
          >
            No results...
          </CommandEmpty>
        )}
        {showList && (
          <CommandList
            className={cn(
              inline &&
                'absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-white shadow-md'
            )}
          >
            {cats.length > 0 && (
              <CommandGroup heading="Categories">
                {cats.map((row) => {
                  return (
                    <CommandItem
                      key={row.name}
                      className="flex justify-between cursor-pointer"
                      asChild
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        void navigate({ to: '/category/$category', params: { category: row.key } });
                        onPick();
                      }}
                    >
                      <Link to="/category/$category" params={{ category: row.key }}>
                        <div className="flex gap-2 items-center">
                          <div className={'w-4'}>
                            <row.icon />
                          </div>
                          <span>{row.name}</span>
                        </div>
                      </Link>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            {technologies.length > 0 && (
              <CommandGroup heading="Technologies">
                {technologies.map((row) => {
                  return (
                    <CommandItem
                      key={row.key}
                      className="flex justify-between cursor-pointer"
                      asChild
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        void navigate({ to: '/tech/$techKey', params: { techKey: row.key } });
                        onPick();
                      }}
                    >
                      <Link to="/tech/$techKey" params={{ techKey: row.key }}>
                        <div className="flex gap-2 items-center">
                          <div className={'w-4'}>
                            <img src={`/favicons/${row.key}.webp`} />
                          </div>
                          <span>{row.name}</span>
                        </div>
                        <div className="text-gray-500 text-xs">{categories[row.type].name}</div>
                      </Link>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
};
