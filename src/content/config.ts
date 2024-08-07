import { defineCollection, z } from 'astro:content';

export const collections = {
	projects: defineCollection({
		type: 'content',
		schema: z.object({
			title: z.string(),
			description: z.string(),
			startDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.array(z.string()),
			img_alt: z.string().optional(),
			git_link: z.string().optional(),
			link: z.string().optional(),
		}),
	}),
};
