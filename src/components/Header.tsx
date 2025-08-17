'use client';

import Link from 'next/link';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Tv, UserCog } from 'lucide-react';

export default function Header() {
  const { isAdmin, logout } = useAdmin();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Tv className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">
            Chilean TV Grid
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/admin">
                    <UserCog className="mr-2 h-4 w-4" /> Admin
                  </Link>
                </Button>
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Admin Login
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
