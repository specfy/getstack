import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export const TT: React.FC<{
  children: React.ReactNode;
  description: string;
}> = ({ children, description }) => {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  );
};
