import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

import type { TooltipContentProps } from '@radix-ui/react-tooltip';

export const TT: React.FC<
  {
    children: React.ReactNode;
    description: React.ReactNode;
  } & TooltipContentProps
> = ({ children, description, ...props }) => {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent {...props}>{description}</TooltipContent>
    </Tooltip>
  );
};
