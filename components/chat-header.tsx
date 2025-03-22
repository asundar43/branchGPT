'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';
import { cn } from '@/lib/utils';

import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, VercelIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { VisibilityType, VisibilitySelector } from './visibility-selector';
import { useFreeTrial } from '@/hooks/use-free-trial';

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  className,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  className?: string;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { isActive: isFreeTrial, daysRemaining, chatsRemaining } = useFreeTrial();

  const { width: windowWidth } = useWindowSize();

  return (
    <div className="flex flex-col">
      {isFreeTrial && (
        <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-1.5 text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>✨ Free Trial Active - {daysRemaining} days remaining</span>
            <span className="text-white/80">({chatsRemaining} chats remaining today)</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={() => router.push('/pricing')}
          >
            Upgrade to Pro
          </Button>
        </div>
      )}
      <header className={cn('sticky top-0 z-50 flex h-14 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
        <div className="flex h-14 items-center gap-4 px-4">
          <SidebarToggle />
          <div className="flex-1" />
          <ModelSelector
            selectedModelId={selectedModelId}
            isFreeTrial={isFreeTrial}
          />
          <VisibilitySelector
            chatId={chatId}
            selectedVisibilityType={selectedVisibilityType}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.push('/chat')}
          >
            <PlusIcon size={16} />
          </Button>
        </div>
      </header>
    </div>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
