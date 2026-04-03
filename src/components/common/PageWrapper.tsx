'use client';

import { ReactNode } from 'react';
import Header from '@/components/common/Header';

type PageWrapperProps = {
  title?: string;
  children: ReactNode;
};

export default function PageWrapper({
  title = '',
  children,
}: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col flex-1 items-center justify-center px-4">
      <Header title={title} />
      <main className="flex flex-1 w-full md:max-w-2xl flex-col items-center sm:items-start py-4 md:py-8">
        {children}
      </main>
    </div>
  );
}
