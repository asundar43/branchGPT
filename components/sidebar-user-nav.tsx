'use client';
import { ChevronUp } from 'lucide-react';
import Image from 'next/image';
import type { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function SidebarUserNav({ user }: { user: User }) {
  const { setTheme, theme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
              <Image
                src={`https://avatar.vercel.sh/${user.email}`}
                alt={user.email ?? 'User Avatar'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="truncate">{user?.email}</span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[--radix-popper-anchor-width] z-[9999]"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={async () => {
                try {
                  // Check subscription status first
                  const response = await fetch('/api/free-trial');
                  const data = await response.json();

                  if (!data.hasSubscription) {
                    // Redirect to pricing page if no subscription
                    window.location.href = '/pricing';
                    return;
                  }

                  console.log('Creating portal session for user:', user.id);
                  const portalResponse = await fetch('/api/create-portal-session', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId: user.id,
                    }),
                  });

                  const portalData = await portalResponse.json();
                  console.log('Portal session response:', portalData);

                  if (!portalResponse.ok) {
                    throw new Error(portalData.error || 'Failed to create portal session');
                  }

                  if (portalData.url) {
                    console.log('Redirecting to portal URL:', portalData.url);
                    window.location.href = portalData.url;
                  } else {
                    throw new Error('No portal URL received');
                  }
                } catch (error) {
                  console.error('Error creating portal session:', error);
                  // Show error toast
                  toast.error('Failed to open billing portal. Please try again.');
                }
              }}
            >
              Manage Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => {
                  signOut({
                    redirectTo: '/',
                  });
                }}
              >
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
