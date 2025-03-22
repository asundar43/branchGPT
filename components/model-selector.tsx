'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

import { saveChatModelAsCookie } from '@/app/(chat)/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { chatModels } from '@/lib/ai/models';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

import { CheckCircleFillIcon, ChevronDownIcon } from './icons';

export function ModelSelector({
  selectedModelId,
  className,
  isFreeTrial = false,
}: {
  selectedModelId: string;
  isFreeTrial?: boolean;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);
  const router = useRouter();
  const { data: session } = useSession();

  const selectedChatModel = useMemo(
    () => chatModels.find((chatModel) => chatModel.id === optimisticModelId),
    [optimisticModelId],
  );

  // Group models by category
  const modelsByCategory = useMemo(() => {
    const groups = chatModels.reduce((acc, model) => {
      const category = model.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(model);
      return acc;
    }, {} as Record<string, typeof chatModels>);
    return groups;
  }, []);

  const handleModelSelect = async (modelId: string) => {
    const model = chatModels.find((m) => m.id === modelId);
    
    // If model is premium and user is in free trial, redirect to pricing
    if (model?.isPremium && isFreeTrial) {
      router.push('/pricing');
      return;
    }

    // If model is premium, verify subscription status
    if (model?.isPremium) {
      try {
        const response = await fetch('/api/subscription/status');
        const { hasActiveSubscription } = await response.json();
        
        if (!hasActiveSubscription) {
          router.push('/pricing');
          return;
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        router.push('/pricing');
        return;
      }
    }
    
    setOpen(false);

    startTransition(() => {
      setOptimisticModelId(modelId);
      saveChatModelAsCookie(modelId);
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button variant="outline" className="md:px-2 md:h-[34px]">
          {selectedChatModel?.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {Object.entries(modelsByCategory).map(([category, models]) => (
          <div key={category}>
            <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
              {category}
            </DropdownMenuLabel>
            {models.map((model) => {
              const { id, freeTrialAvailable, isPremium } = model;
              const isDisabled = (isFreeTrial && !freeTrialAvailable) || (isPremium && isFreeTrial);

              return (
                <DropdownMenuItem
                  key={id}
                  onSelect={() => handleModelSelect(id)}
                  className={cn(
                    "gap-4 group/item flex flex-row justify-between items-center",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  data-active={id === optimisticModelId}
                >
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-center gap-2">
                      {model.name}
                      {isDisabled && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          <span>Pro</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {model.description}
                    </div>
                  </div>

                  <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                    <CheckCircleFillIcon />
                  </div>
                </DropdownMenuItem>
              );
            })}
            {category !== Object.keys(modelsByCategory)[Object.keys(modelsByCategory).length - 1] && (
              <DropdownMenuSeparator />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
