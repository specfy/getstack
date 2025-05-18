import {
  IconAt,
  IconBrandGithub,
  IconBrandLinkedin,
  IconSearch,
  IconStack2,
} from '@tabler/icons-react';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useState } from 'react';

import { Newsletter } from '@/components/Newsletter';
import { Search } from '@/components/Search';
import { Button } from '@/components/ui/button';
import { CommandDialog } from '@/components/ui/command';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePageTracking } from '@/lib/ga';

export const Route = createRootRoute({
  component: () => {
    usePageTracking();
    return (
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
    );
  },
});

export const Header: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="flex justify-between items-center mt-2 mb-1 px-4">
      <Link className="h-8 flex gap-1.5 items-center font-light text-md text-gray-700" to="/">
        <IconStack2 /> <span className="font-medium tracking-tighter">getStack</span>
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
                <a href="https://github.com/specfy/getstack?ref=getstack.dev" target="_blank">
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

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t pt-10 pb-10 flex flex-col md:flex-row gap-6 md:justify-between items-start px-4">
      <div>
        <div className="md:w-80 mb-4">
          <Newsletter />
        </div>
        <div className="flex mb-2 gap-2">
          <a href="mailto:contact@getstack.dev">
            <Button variant={'outline'} size={'sm'}>
              <IconAt />
            </Button>
          </a>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={'outline'} size={'sm'}>
                <IconBrandGithub />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-70 flex flex-col gap-4" align="start">
              <Button variant={'outline'} className="justify-start" asChild>
                <a
                  href="https://github.com/specfy/stack-analyser?ref=getstack.dev"
                  target="_blank"
                  className="flex gap-2 items-center"
                >
                  <img src={`/favicons/github.webp`} className="w-5 h-5" /> @specfy/stack-analyzer
                </a>
              </Button>
              <Button variant={'outline'} className="justify-start" asChild>
                <a
                  href="https://github.com/specfy/getstack?ref=getstack.dev"
                  target="_blank"
                  className="flex gap-2 items-center"
                >
                  <img src={`/favicons/github.webp`} className="w-5 h-5" />
                  @specfy/getstack
                </a>
              </Button>
            </PopoverContent>
          </Popover>
          <a href="https://www.linkedin.com/in/bodinsamuel/" target="_blank">
            <Button variant={'outline'} size={'sm'}>
              <IconBrandLinkedin />
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
      <div className="text-sm flex flex-col gap-1.5 md:items-end">
        <Link to="/about" className="text-gray-700 transition-colors hover:text-gray-950">
          About
        </Link>
        <Link to="/private" className="text-gray-700 transition-colors hover:text-gray-950">
          Analyze my repo
        </Link>
        <a
          href="https://github.com/specfy/stack-analyser/issues?ref=getstack.dev"
          target="_blank"
          className="text-gray-700 transition-colors hover:text-gray-950"
        >
          Suggest a tool
        </a>
      </div>
    </footer>
  );
};
