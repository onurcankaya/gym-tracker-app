'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Triangle, Loader, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useGetUser } from '@/hooks/useUser';

export default function Header() {
  const [open, setOpen] = useState(false);

  const { data: session, status } = useSession();
  const { data: user } = useGetUser(session?.user?.id || '');

  const router = useRouter();

  return (
    <div className="absolute mx-auto sm:max-w-full max-w-3xl top-0 right-4 left-4 py-4 px-0 md:px-2 z-999 flex items-center justify-between">
      <div className="w-8 h-8 flex items-center justify-center">
        <Button variant="ghost" onClick={() => router.push('/')}>
          <Triangle className="text-neon-green-300" />
        </Button>
      </div>

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
    </div>
  );
}
