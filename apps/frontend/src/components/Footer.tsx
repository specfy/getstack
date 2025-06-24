import { IconAt, IconBrandGithub, IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

import { Newsletter } from '@/components/Newsletter';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t pt-10 pb-10 flex flex-col md:flex-row gap-6 md:justify-between items-start px-4">
      <div>
        <div className="md:w-80 mb-4">
          <Newsletter />
        </div>
        <div className="flex mb-2 gap-2">
          <a href="https://x.com/samdotb" target="_blank">
            <Button variant={'outline'} size={'sm'}>
              <IconBrandTwitter />
            </Button>
          </a>
          <a href="mailto:contact@getstack.dev" target="_blank">
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
                  href="https://github.com/specfy/stack-analyser?utm_source=getstack.dev"
                  target="_blank"
                  className="flex gap-2 items-center"
                >
                  <img src={`/favicons/github.webp`} className="w-5 h-5" /> @specfy/stack-analyzer
                </a>
              </Button>
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
          <a href="https://x.com/samdotb" className="font-semibold" target="_blank">
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
          href="https://github.com/specfy/stack-analyser?utm_source=getstack.dev"
          target="_blank"
          className="text-gray-700 transition-colors hover:text-gray-950"
        >
          Suggest a tool
        </a>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=specfy&repo=stack-analyser&type=star&count=true&size=medium"
          width="100"
          height="30"
          title="GitHub"
        ></iframe>
      </div>
    </footer>
  );
};
