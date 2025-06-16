import { IconMenu2, IconSearch, IconStack2 } from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
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
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onOpenChange = useCallback((open: boolean) => {
    setMenuOpen(open);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className=" mt-2 mb-1 px-4">
      <div className="flex md:hidden justify-between items-center ">
        <Popover open={menuOpen} onOpenChange={onOpenChange}>
          <div className="flex gap-2 items-center">
            <Link className="h-8 flex gap-1.5 items-center font-light text-md text-gray-700" to="/">
              <IconStack2 /> <span className="font-medium tracking-tighter">getStack</span>
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex gap-0 items-center">
              <Button variant={'ghost'} size="icon" onClick={() => setSearchOpen(true)}>
                <IconSearch size={18} stroke={1} />
              </Button>
              <Button variant={'ghost'} size="icon" asChild>
                <a
                  href="https://github.com/specfy/stack-analyser?utm_source=getstack.dev"
                  target="_blank"
                >
                  <img src={`/favicons/github.webp`} className="w-4 h-4" />
                </a>
              </Button>
            </div>
            <PopoverTrigger asChild>
              <Button variant={'ghost'} size="icon" className="border-l pl-4">
                <IconMenu2 stroke={1} size={18} />
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="h-screen w-screen top-0 left-0">
            <div className="flex flex-col gap-4 p-4">
              <Link to="/" className="text-lg">
                Home
              </Link>
              <Link to="/licenses" className="text-lg">
                Licenses Tracker
              </Link>
              <Link to="/private" className="text-lg">
                Analyze Repo
              </Link>
              <Link to="/blog" className="text-lg">
                Blog
              </Link>
              <Link to="/about" className="text-lg">
                About
              </Link>
            </div>

            <hr />

            <div className="flex flex-col gap-2 mt-6">
              <div>
                <Button variant={'outline'} className="justify-start" asChild>
                  <a
                    href="https://github.com/specfy/stack-analyser?utm_source=getstack.dev"
                    target="_blank"
                    className="flex gap-2 items-center"
                  >
                    <img src={`/favicons/github.webp`} className="w-5 h-5" /> @specfy/stack-analyzer
                  </a>
                </Button>
              </div>
              <div>
                <Button variant={'outline'} className="justify-start" asChild>
                  <a
                    href="https://github.com/specfy/getstack?utm_source=getstack.dev"
                    target="_blank"
                    className="flex gap-2 items-center"
                  >
                    <img src={`/favicons/github.webp`} className="w-5 h-5" />
                    @specfy/getstack
                  </a>
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="hidden md:flex justify-between items-center ">
        <Link className="h-8 flex gap-1.5 items-center font-light text-md text-gray-700" to="/">
          <IconStack2 /> <span className="font-medium tracking-tighter">getStack</span>
          <div className="text-xs pt-0.5">Technology Trends</div>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Button variant={'ghost'} size="icon" onClick={() => setSearchOpen(true)}>
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
              <NavigationMenuLink href="/licenses" asChild>
                <Link to="/licenses">Licenses</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/private" asChild>
                <Link to="/private">My Repo</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/blog" asChild>
                <Link to="/blog">Blog</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/about" asChild>
                <Link to="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {/* <Button variant={'ghost'} className="justify-start" asChild>
                  <a
                    href="https://github.com/specfy/stack-analyser?utm_source=getstack.dev"
                    target="_blank"
                    className="flex flex-row gap-2"
                  >
                    <img src={`/favicons/github.webp`} className="w-5 h-5" />
                    <div className="text-sm">290</div>
                  </a>
                </Button> */}
              <iframe
                src="https://ghbtns.com/github-btn.html?user=specfy&repo=stack-analyser&type=star&count=true&size=medium"
                width="90"
                height="30"
                title="GitHub"
                className="mt-2.5"
              ></iframe>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <Search onPick={() => setSearchOpen(false)}></Search>
      </CommandDialog>
    </header>
  );
};
