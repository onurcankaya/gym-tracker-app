'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Loader, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useGetUser } from '@/hooks/useUser';

export default function Header({ title }: { title: string }) {
  const [open, setOpen] = useState(false);

  const { data: session, status } = useSession();
  const { data: user } = useGetUser(session?.user?.id || '');

  const router = useRouter();

  return (
    <header className="w-full flex items-center justify-between py-4">
      <Button variant="ghost" onClick={() => router.push('/')}>
        <img src="/pulse-logo.png" alt="pulse app logo" className="w-6 h-6" />
      </Button>

      <h1 className="text-sm sm:text-base font-semibold">{title}</h1>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex items-center">
          <span className="flex items-center gap-2 border rounded-md px-3 py-1.5 text-xs sm:text-sm">
            {status === 'loading' ? (
              <Spinner icon={Loader} />
            ) : (
              <>
                {user?.name}
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="w-40 sm:w-60 p-3 space-y-3"
          align="end"
          sideOffset={8}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs sm:text-sm"
            onClick={() => router.push('/')}
          >
            Workouts
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs sm:text-sm"
            onClick={() => router.push('/stats')}
          >
            Stats
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs sm:text-sm"
            onClick={() => router.push('/profile')}
          >
            Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs sm:text-sm"
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </PopoverContent>
      </Popover>
    </header>
  );
}
