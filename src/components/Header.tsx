'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import AdminPanelContent from './AdminPanel';
import {
  LogIn,
  Tv,
  UserCog,
  LayoutGrid,
  Loader2,
  LockKeyhole,
  RectangleHorizontal,
  LayoutDashboard,
} from 'lucide-react';
import { useGrid } from '@/hooks/useGrid';
import LoginForm from './LoginForm';
import { useTheater } from '@/hooks/useTheater';

export default function Header() {
  const { isAdmin, isLoading } = useAdmin();
  const { gridSize, setGridSize } = useGrid();
  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);
  const { isTheaterMode, toggleTheaterMode } = useTheater();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 px-5 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Tv className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">
            Chilean TV Grid
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <LayoutDashboard />
                <span className="sr-only">Layout Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleTheaterMode}>
                {isTheaterMode ? (
                  <>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>Modo Grilla</span>
                  </>
                ) : (
                  <>
                    <RectangleHorizontal className="mr-2 h-4 w-4" />
                    <span>Modo Teatro</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  <span>Tamaño Grilla ({gridSize})</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={gridSize}
                    onValueChange={(value) =>
                      setGridSize(value as '2x2' | '3x3' | '4x4' | '5x5')
                    }
                  >
                    <DropdownMenuRadioItem value="2x2">2x2</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="3x3">3x3</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="4x4">4x4</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="5x5">5x5</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>

          <nav className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isAdmin ? (
              <>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost">
                      <UserCog className="mr-2 h-4 w-4" /> Ajustes
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-1/2 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Panel de Administración</SheetTitle>
                      <SheetDescription>
                        Gestiona los canales de la grilla.
                      </SheetDescription>
                    </SheetHeader>
                    <AdminPanelContent />
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <Sheet open={isLoginSheetOpen} onOpenChange={setIsLoginSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost">
                    <LogIn className="mr-2 h-4 w-4" /> Admin Login
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full max-w-sm">
                  <SheetHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <LockKeyhole className="h-8 w-8 text-primary" />
                    </div>
                    <SheetTitle>Acceso de Administrador</SheetTitle>
                    <SheetDescription>
                      Ingrese la contraseña para gestionar los canales.
                    </SheetDescription>
                  </SheetHeader>
                  <LoginForm
                    onLoginSuccess={() => setIsLoginSheetOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
