'use client';

import { ReactNode, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Lock, Globe } from 'lucide-react';

import {
  CheckCircleFillIcon,
  ChevronDownIcon,
  LockIcon,
} from './icons';
import { useChatVisibility } from '@/hooks/use-chat-visibility';

export type VisibilityType = 'private' | 'public';

const visibilities: Array<{
  id: VisibilityType;
  label: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    id: 'private',
    label: 'Private',
    description: 'Only you can access this chat',
    icon: <LockIcon />,
  },
  {
    id: 'public',
    label: 'Public',
    description: 'Anyone with the link can access this chat',
    icon: <Globe />,
  },
];

interface VisibilitySelectorProps {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isFreeTrial?: boolean;
}

export function VisibilitySelector({
  chatId,
  selectedVisibilityType,
  isFreeTrial,
}: VisibilitySelectorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId,
    initialVisibility: selectedVisibilityType,
  });

  const selectedVisibility = useMemo(
    () => visibilities.find((visibility) => visibility.id === visibilityType),
    [visibilityType],
  );

  const handleVisibilitySelect = (visibility: VisibilityType) => {
    if (visibility === 'public' && isFreeTrial) {
      router.push('/pricing');
      return;
    }
    setVisibilityType(visibility);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        )}
      >
        <Button
          variant="outline"
          className="hidden md:flex md:px-2 md:h-[34px] w-[120px] justify-between"
        >
          {selectedVisibility?.icon}
          <span className="ml-2 capitalize">{selectedVisibility?.label}</span>
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[300px] w-[120px]">
        {visibilities.map((visibility) => {
          const isDisabled = visibility.id === 'public' && isFreeTrial;
          return (
            <DropdownMenuItem
              key={visibility.id}
              onSelect={() => handleVisibilitySelect(visibility.id)}
              className={cn(
                "gap-4 group/item flex flex-row justify-between items-center",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              data-active={visibility.id === visibilityType}
            >
              <div className="flex flex-col gap-1 items-start">
                <div className="flex items-center gap-2">
                  {visibility.label}
                  {isDisabled && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Pro</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {visibility.description}
                </div>
              </div>
              <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                {visibility.id === 'private' ? <LockIcon /> : <Globe />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
