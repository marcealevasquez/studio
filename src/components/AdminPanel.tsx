'use client';

import { useChannels } from '@/hooks/useChannels';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import ChannelForm from '@/components/ChannelForm';
import { Channel } from '@/types';
import { PlusCircle, Trash2, Pencil, Loader2, LogOut, Eye, EyeOff } from 'lucide-react';
import { getYouTubeId } from '@/lib/utils';

export default function AdminPanelContent() {
  const { channels, deleteChannel, isLoaded: areChannelsLoaded, toggleChannelVisibility } = useChannels();
  const { logout } = useAdmin();

  const getChannelIdentifier = (url: string) => {
    return getYouTubeId(url) || 'URL Inválida';
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow py-8">
        <div className="mb-6 flex items-center justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Canal
              </Button>
            </DialogTrigger>
            <ChannelForm />
          </Dialog>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nombre</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="w-[120px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!areChannelsLoaded ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : channels.length > 0 ? (
                channels.map((channel: Channel) => (
                  <TableRow key={channel.id}>
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                       {getChannelIdentifier(channel.url)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                         <Button variant="ghost" size="icon" onClick={() => toggleChannelVisibility(channel.id)}>
                          {channel.isVisible ?? true ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <ChannelForm channel={channel} />
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará
                                permanentemente el canal.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteChannel(channel.id)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No hay canales. Agrega uno para empezar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
       <div className="mt-auto border-t pt-4">
          <Button variant="ghost" onClick={logout} className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>
    </div>
  );
}
