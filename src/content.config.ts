import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      tags: z.array(z.string()),
      logo: image(),
      sections: z.record(
        z.string(),
        z.object({
          title: z.string(),
          content: z.any(),
        }),
      ),
    }),
});

export const collections = { projects };
