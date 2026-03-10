'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Triangle, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [open, setOpen] = useState(false);

  const { data: session } = useSession();

  return (
    <div className="absolute mx-auto sm:max-w-full max-w-3xl top-0 right-4 left-4 py-4 px-0 md:px-2 z-999 flex items-center justify-between">
      <div className="w-8 h-8 flex items-center justify-center">
        <Triangle className="w-5 h-5 text-neon-green-300" />
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex items-center">
          <span className="flex gap-2 border rounded-md px-3 py-1.5">
            <p className="text-xs">{session?.user.name}</p>
            <ChevronDown className="h-4 w-4" />
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-40" align="end" sideOffset={8}>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => signOut()}
          >
            <p className="text-xs">Sign out</p>
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
