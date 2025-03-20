import { Pricing } from '@/components/pricing';
import { Providers } from '@/components/providers';

export default function PricingPage() {
  return (
    <Providers>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Pricing />
      </main>
    </Providers>
  );
} 