import { IconAt, IconBrandGithub, IconSearch, IconStack2 } from '@tabler/icons-react';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
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

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col w-full max-w-screen-lg">
        <Header />
        <div className="h-full px-4">
          <Outlet />
        </div>
        <Footer />
        <TanStackRouterDevtools />
      </div>
    </div>
  ),
});

export const Header: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="flex justify-between items-center mt-1 mb-1 px-4">
      <Link className="h-8 flex gap-2 items-center font-light text-lg text-gray-700" to="/">
        <IconStack2 /> useStack
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
          <NavigationMenuItem>
            <NavigationMenuLink href="/" asChild>
              <Link to="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about" asChild>
              <Link to="/about">About</Link>
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

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t pt-10 pb-10 flex justify-between items-end px-4">
      <div>
        <div className="flex mb-2 gap-2">
          <a href="mailto:contact@usestack.dev">
            <Button variant={'outline'} size={'sm'} className="rounded-full">
              <IconAt />
            </Button>
          </a>
          <a href="https://github.com/specfy/stack-analyser?ref=usestack.dev" target="_blank">
            <Button variant={'outline'} size={'sm'} className="rounded-full">
              <IconBrandGithub />
            </Button>
          </a>
        </div>
        <div className="text-xs text-gray-600">
          Made by{' '}
          <a href="https://x.com/samdotb" className="font-semibold">
            Samuel Bodin
          </a>
        </div>
      </div>
      <div className="text-xs flex flex-col gap-1.5 items-end">
        <Link to="/about" className="text-gray-700 transition-colors hover:text-gray-950">
          About
        </Link>

        <a
          href="https://github.com/specfy/stack-analyser/issues?ref=usestack.dev"
          target="_blank"
          className="text-gray-700 transition-colors hover:text-gray-950"
        >
          Suggest a tool
        </a>
      </div>
    </footer>
  );
};
