import { IconSearch, IconStack2 } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import { Search } from '@/components/Search';
import { Button } from '@/components/ui/button';
import { CommandDialog } from '@/components/ui/command';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

export const Header: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="flex justify-between items-center mt-2 mb-1 px-4">
      <Link className="h-8 flex gap-1.5 items-center font-light text-md text-gray-700" to="/">
        <IconStack2 /> <span className="font-medium tracking-tighter">getStack</span>
        <div className="text-xs pt-0.5">Open Source Trends</div>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Button variant={'ghost'} size="icon" onClick={() => setOpen(true)}>
                <IconSearch />
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden md:inline-block">
            <NavigationMenuLink href="/" asChild>
              <Link to="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/private" asChild>
              <Link to="/private">My Repo</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about" asChild>
              <Link to="/about">About</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Button variant={'ghost'} size="icon" className="justify-start" asChild>
                <a
                  href="https://github.com/specfy/stack-analyser?utm_source=getstack.dev"
                  target="_blank"
                >
                  <img src={`/favicons/github.webp`} className="w-5 h-5" />
                </a>
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Search onPick={() => setOpen(false)}></Search>
      </CommandDialog>
    </header>
  );
};
