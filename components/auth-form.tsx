'use client';

import Form from 'next/form';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { GoogleSignInButton } from './google-sign-in-button';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <GoogleSignInButton />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="email"
            className="text-zinc-600 font-normal dark:text-zinc-400"
          >
            Email Address
          </Label>

          <Input
            id="email"
            name="email"
            className="bg-muted text-md md:text-sm"
            type="email"
            placeholder="user@acme.com"
            autoComplete="email"
            required
            autoFocus
            defaultValue={defaultEmail}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="password"
            className="text-zinc-600 font-normal dark:text-zinc-400"
          >
            Password
          </Label>

          <Input
            id="password"
            name="password"
            className="bg-muted text-md md:text-sm"
            type="password"
            required
          />
        </div>

        {children}
      </Form>
    </div>
  );
}
