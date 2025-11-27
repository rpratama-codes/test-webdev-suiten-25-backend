import z from 'zod';

export const addPositionNameDto = z.object({
	name: z.string(),
});

export const updatePositionNameDto = z.object({
	id: z.string(),
	name: z.string().optional(),
});

export type UpdatePositionNameDto = z.infer<typeof updatePositionNameDto>;

export type AddPositionNameDto = z.infer<typeof addPositionNameDto>;
