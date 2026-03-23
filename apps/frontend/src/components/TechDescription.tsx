import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const TechDescription: React.FC<{ content: string }> = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const hadOverflowRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const overflows = el.scrollHeight > el.clientHeight;
    if (!expanded) {
      hadOverflowRef.current = overflows;
      setHasOverflow(overflows);
    }
  }, [content, expanded]);

  const showButtons = hasOverflow || (expanded && hadOverflowRef.current);

  return (
    <div className="relative max-w-4xl">
      <div className="relative">
        <div
          ref={contentRef}
          className={cn(
            'text-s prose prose-gray prose-p:my-4 prose-p:first:mt-0 prose-ul:my-4 prose-li:my-1 prose-headings:my-4 max-w-none text-pretty font-mono font-light text-gray-600',
            !expanded && 'overflow-hidden'
          )}
          style={expanded ? undefined : { maxHeight: '10rem' }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {!expanded && hasOverflow && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-neutral-950"
            aria-hidden
          />
        )}
      </div>
      {showButtons &&
        (expanded ? (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-gray-500 hover:text-gray-700"
            onClick={() => setExpanded(false)}
          >
            View less
          </Button>
        ) : (
          <div className="relative mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setExpanded(true)}
            >
              View more
            </Button>
          </div>
        ))}
    </div>
  );
};
