import {
  IconAt,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconStack2,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

import { Newsletter } from '@/components/Newsletter';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const Footer: React.FC = () => {
  return (
    <footer className="mx-auto mt-10 w-full max-w-screen-xl border-t px-4 pb-6 pt-10">
      <div className="mb-8 flex flex-col gap-8 md:flex-row md:gap-12">
        {/* Left Column - getstack Info */}
        <div className="md:w-80">
          <div className="mb-3 flex items-center gap-1.5">
            <IconStack2 size={20} />
            <span className="font-medium tracking-tighter text-gray-900">getStack</span>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Real-time tech stack intelligence for modern engineering teams.
          </p>
          <div className="flex gap-2">
            <a href="https://x.com/samdotb" target="_blank" rel="noopener noreferrer">
              <Button variant={'outline'} size={'sm'} title="Twitter">
                <IconBrandTwitter size={16} />
              </Button>
            </a>
            <a
              href="mailto:contact@getstack.dev"
              target="_blank"
              rel="noopener noreferrer"
              title="Email"
            >
              <Button variant={'outline'} size={'sm'}>
                <IconAt size={16} />
              </Button>
            </a>
            <a
              href="https://linkedin.com/in/bodinsamuel?utm_source=getstack.dev"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <Button variant={'outline'} size={'sm'}>
                <IconBrandLinkedin size={16} />
              </Button>
            </a>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} size={'sm'} title="GitHub">
                  <IconBrandGithub size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-70 flex flex-col gap-4" align="start">
                <Button variant={'outline'} className="justify-start" asChild>
                  <a
                    href="https://github.com/specfy/stack-analyser?utm_source=getstack.dev"
                    target="_blank"
                    rel="noopener noreferrer"
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
                <Button variant={'outline'} className="justify-start" asChild>
                  <a
                    href="https://github.com/specfy/getstack?utm_source=getstack.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <img
                      src={`/favicons/github.webp`}
                      className="size-5"
                      alt="GitHub logo"
                      width={20}
                      height={20}
                    />
                    @specfy/getstack
                  </a>
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Middle Columns - Links */}
        <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">GetStack</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/about" className="text-gray-600 transition-colors hover:text-gray-900">
                About
              </Link>
              <Link to="/blog" className="text-gray-600 transition-colors hover:text-gray-900">
                Blog
              </Link>
              <Link to="/private" className="text-gray-600 transition-colors hover:text-gray-900">
                Analyze your repo
              </Link>
            </div>
          </div>

          <div>
            <Newsletter title="Subscribe to our newsletter" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs text-gray-600 md:flex-row">
        <div>
          Made by{' '}
          <a
            href="https://twitter.com/samdotb"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-900"
          >
            Samuel Bodin
          </a>
        </div>
      </div>
    </footer>
  );
};
