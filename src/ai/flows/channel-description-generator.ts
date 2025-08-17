'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a channel description.
 *
 * - generateChannelDescription - An async function that calls the flow to generate channel description.
 * - ChannelDescriptionInput - The input type for the channel description.
 * - ChannelDescriptionOutput - The output type for the channel description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChannelDescriptionInputSchema = z.object({
  channelName: z.string().describe('The name of the TV channel.'),
  channelUrl: z.string().url().describe('The URL of the TV channel.'),
});
export type ChannelDescriptionInput = z.infer<typeof ChannelDescriptionInputSchema>;

const ChannelDescriptionOutputSchema = z.object({
  channelDescription: z.string().describe('La descripción del canal de TV generada por IA.'),
});
export type ChannelDescriptionOutput = z.infer<typeof ChannelDescriptionOutputSchema>;

export async function generateChannelDescription(input: ChannelDescriptionInput): Promise<ChannelDescriptionOutput> {
  return channelDescriptionFlow(input);
}

const channelDescriptionPrompt = ai.definePrompt({
  name: 'channelDescriptionPrompt',
  input: {schema: ChannelDescriptionInputSchema},
  output: {schema: ChannelDescriptionOutputSchema},
  prompt: `You are an AI assistant specializing in creating engaging and informative descriptions for TV channels.

  Based on the channel's name and URL, generate a concise description in Spanish that captures the essence of the channel's content and target audience.

  Channel Name: {{{channelName}}}
  Channel URL: {{{channelUrl}}}

  Description:`, // Ensure output adheres to the ChannelDescriptionOutputSchema
});

const channelDescriptionFlow = ai.defineFlow(
  {
    name: 'channelDescriptionFlow',
    inputSchema: ChannelDescriptionInputSchema,
    outputSchema: ChannelDescriptionOutputSchema,
  },
  async input => {
    const {output} = await channelDescriptionPrompt(input);
    return output!;
  }
);
