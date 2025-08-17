'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Channel } from '@/types';
import { useChannels } from '@/hooks/useChannels';
import { useToast } from '@/hooks/use-toast';
import { generateChannelDescription } from '@/ai/flows/channel-description-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  url: z.string().url({ message: 'Por favor, ingrese una URL válida.' }),
  description: z.string().optional(),
});

interface ChannelFormProps {
  channel?: Channel;
}

export default function ChannelForm({ channel }: ChannelFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { addChannel, updateChannel } = useChannels();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: channel?.name || '',
      url: channel?.url || '',
      description: channel?.description || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      if (channel) {
        updateChannel({ ...channel, ...values });
        toast({ title: 'Éxito', description: 'Canal actualizado correctamente.' });
      } else {
        addChannel(values);
        toast({ title: 'Éxito', description: 'Canal agregado correctamente.' });
      }
      setIsOpen(false);
      form.reset();
    } catch (error) {
       toast({ title: 'Error', description: 'No se pudo guardar el canal.', variant: 'destructive' });
    }
  };

  const handleGenerateDescription = async () => {
    const { name, url } = form.getValues();
    if (!name || !url) {
      toast({
        title: 'Error',
        description: 'Se requiere nombre y URL para generar una descripción.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateChannelDescription({ channelName: name, channelUrl: url });
      form.setValue('description', result.channelDescription);
    } catch (error) {
      toast({
        title: 'Error de IA',
        description: 'No se pudo generar la descripción.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{channel ? 'Editar Canal' : 'Agregar Canal'}</DialogTitle>
        <DialogDescription>
          {channel
            ? 'Realiza cambios en el canal existente.'
            : 'Agrega un nuevo canal a la grilla.'}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Canal</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Meganoticias" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de YouTube / Twitch</FormLabel>
                <FormControl>
                  <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Descripción</FormLabel>
                   <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    )}
                    Generar con IA
                  </Button>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Descripción del canal..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancelar</Button>
            </DialogClose>
            <Button type="submit">
                {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
