import { z } from 'astro/zod';

const versionSchema = z.string().regex(/v\d+\.\d+\.\d+/);

export const commandSchema = z.object({
  availableFrom: versionSchema,
  names: z.array(z.string()),
  args: z.optional(
    z.array(
      z.object({
        name: z.string(),
        about: z.string(),
        defaultValue: z.optional(z.string()),
        availableFrom: z.optional(versionSchema)
      })
    )
  )
});

export type Command = z.infer<typeof commandSchema>;

export const pageSchema = z.object({
  title: z.string(),
  command: z.optional(commandSchema)
});

export const pagePayload = pageSchema.extend({ uri: z.string() });

export type Page = z.infer<typeof pagePayload>;
