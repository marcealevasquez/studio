import ChannelGrid from '@/components/ChannelGrid';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<GridSkeleton />}>
        <ChannelGrid />
      </Suspense>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      ))}
    </div>
  );
}
