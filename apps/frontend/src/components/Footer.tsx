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
    <footer className="mt-20 border-t px-4 pb-6 pt-10">
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
        <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">PRODUCT</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="/docs" className="text-gray-600 transition-colors hover:text-gray-900">
                Documentation
              </a>
              <a href="/api" className="text-gray-600 transition-colors hover:text-gray-900">
                API Reference
              </a>
              <a href="/pricing" className="text-gray-600 transition-colors hover:text-gray-900">
                Pricing
              </a>
              <Link to="/private" className="text-gray-600 transition-colors hover:text-gray-900">
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">COMPANY</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/blog" className="text-gray-600 transition-colors hover:text-gray-900">
                Blog
              </Link>
              <a href="/roadmap" className="text-gray-600 transition-colors hover:text-gray-900">
                Roadmap
              </a>
              <a
                href="https://github.com/specfy/stack-analyser?utm_source=getstack.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                Contributors
              </a>
              <a href="/privacy" className="text-gray-600 transition-colors hover:text-gray-900">
                Privacy
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">SYSTEMS</h4>
            <div className="flex flex-col gap-2 text-sm">
              <div className="text-gray-600">
                API STATUS: <span className="font-semibold text-green-600">STABLE</span>
              </div>
              <div className="text-gray-600">
                SYNC RATE: <span className="font-semibold">120ms</span>
              </div>
              <div className="text-gray-600">
                REGIONS: <span className="font-semibold">US-EAST-1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs text-gray-600 md:flex-row">
        <div>© 2024 GETSTACK ANALYTICS. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-4">
          <a href="/security" className="transition-colors hover:text-gray-900">
            SECURITY
          </a>
          <a href="/terms" className="transition-colors hover:text-gray-900">
            TERMS
          </a>
          <a href="/legal" className="transition-colors hover:text-gray-900">
            LEGAL
          </a>
        </div>
      </div>
    </footer>
  );
};
