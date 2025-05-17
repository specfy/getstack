import { Link, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { categories, listCategories, listTech } from '@/lib/stack';

export const Search: React.FC<{ children?: JSX.Element; onPick: () => void }> = ({ onPick }) => {
  const navigate = useNavigate();
  // const [open, setOpen] = useState<boolean>(true);
  const [search, setSearch] = useState('');

  const cats = useMemo(() => {
    const s = search.toLocaleLowerCase();
    return listCategories.filter((v) => v.name.includes(search) || v.keyword.includes(s));
  }, [search]);
  const technologies = useMemo(() => {
    return listTech
      .filter((v) => v.name.includes(search) || v.key.includes(search) || v.type.includes(search))
      .slice(0, 50);
  }, [search]);

  // useEffect(() => {
  //   const down = (e: KeyboardEvent) => {
  //     if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault();
  //       setOpen((prev) => !prev);
  //     }
  //   };

  //   document.addEventListener('keydown', down);
  //   return () => document.removeEventListener('keydown', down);
  // }, []);

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder="Search for category or technology..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
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
    </Command>
  );
};
