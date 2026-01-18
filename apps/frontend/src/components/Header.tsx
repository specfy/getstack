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
    <header className="bg-white pb-1 pt-2">
      <div className="mx-auto max-w-screen-xl px-4 ">
        <div className="flex items-center justify-between md:hidden ">
          <Popover open={menuOpen} onOpenChange={onOpenChange}>
            <div className="flex items-center gap-2">
              <Link
                className="text-md flex h-8 items-center gap-1.5 font-light text-gray-700"
                to="/"
                title="Home"
              >
                <IconStack2 /> <span className="font-medium tracking-tighter">getStack</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0">
                <Button
                  variant={'ghost'}
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  title="Search"
                >
                  <IconSearch size={18} stroke={1} />
                </Button>
                <Button variant={'ghost'} size="icon" asChild title="GitHub">
                  <a
                    href="https://github.com/specfy/stack-analyser?utm_source=getstack.dev"
                    target="_blank"
                  >
                    <img
                      src={`/favicons/github.webp`}
                      className="size-4"
                      alt="GitHub logo"
                      width={16}
                      height={16}
                    />
                  </a>
                </Button>
              </div>
              <PopoverTrigger asChild>
                <Button variant={'ghost'} size="icon" className="border-l pl-4" title="Menu">
                  <IconMenu2 stroke={1} size={18} />
                </Button>
              </PopoverTrigger>
            </div>
            <PopoverContent className="left-0 top-0 h-screen w-screen">
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

              <div className="mt-6 flex flex-col gap-2">
                <div>
                  <Button variant={'outline'} className="justify-start" asChild>
                    <a
                      href="https://github.com/specfy/stack-analyser?utm_source=getstack.dev"
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <img
                        src={`/favicons/github.webp`}
                        className="size-5"
                        alt="GitHub logo"
                        width={20}
                        height={20}
                      />{' '}
                      @specfy/stack-analyzer
                    </a>
                  </Button>
                </div>
                <div>
                  <Button variant={'outline'} className="justify-start" asChild>
                    <a
                      href="https://github.com/specfy/getstack?utm_source=getstack.dev"
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <img
                        src={`/favicons/github.webp`}
                        className="size-5"
                        alt="GitHub logo"
                        width={20}
                        height={20}
                      />{' '}
                      @specfy/getstack
                    </a>
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden items-center justify-between md:flex ">
          <Link
            className="flex h-8 items-center gap-1.5 font-light text-gray-700"
            to="/"
            title="Home"
          >
            <IconStack2 /> <span className="font-medium tracking-tighter">getStack</span>
            <div className="ml-1 pt-0.5 font-serif text-xs">TECH TRENDS</div>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    variant={'ghost'}
                    size="icon"
                    onClick={() => setSearchOpen(true)}
                    title="Search"
                  >
                    <IconSearch />
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden md:inline-block">
                <NavigationMenuLink href="/" asChild>
                  <Link to="/" className="text-gray-700 hover:text-gray-900">
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/licenses" asChild>
                  <Link to="/licenses" className="text-gray-700 hover:text-gray-900">
                    Licenses
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/private" asChild>
                  <Link to="/private" className="text-gray-700 hover:text-gray-900">
                    My Repo
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/blog" asChild>
                  <Link to="/blog" className="text-gray-700 hover:text-gray-900">
                    Blog
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" asChild>
                  <Link to="/about" className="text-gray-700 hover:text-gray-900">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=specfy&repo=stack-analyser&type=star&count=true&size=medium"
                  width="100"
                  height="30"
                  title="GitHub"
                  className="mt-2.5"
                ></iframe>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <Search onPick={() => setSearchOpen(false)}></Search>
      </CommandDialog>
    </header>
  );
};
