'use client';

import { useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LockKeyhole } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const { login } = useAdmin();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      toast({
        title: 'Éxito',
        description: 'Has iniciado sesión correctamente.',
      });
      onLoginSuccess();
    } else {
      toast({
        title: 'Error',
        description: 'Contraseña incorrecta.',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
       <Card className="w-full max-w-sm border-0 shadow-none">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <LockKeyhole className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Acceso de Administrador</CardTitle>
          <CardDescription>
            Ingrese la contraseña para gestionar los canales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
