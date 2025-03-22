import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

interface FreeTrial {
  isActive: boolean;
  daysRemaining: number;
  chatsRemaining: number;
}

export function useFreeTrial() {
  const { data, error, mutate } = useSWR<FreeTrial>(
    '/api/free-trial',
    fetcher
  );

  return {
    isActive: data?.isActive ?? false,
    daysRemaining: data?.daysRemaining ?? 0,
    chatsRemaining: data?.chatsRemaining ?? 0,
    isLoading: !error && !data,
    error,
    mutate,
  };
} 