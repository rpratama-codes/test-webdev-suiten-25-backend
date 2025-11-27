import z from 'zod';

export const createAttendanceDto = z.object({
	date: z.string(),
	employee_id: z.string(),
	time: z.string(),
	note: z.string(),
});

export const updateAttendanceDto = z.object({
	id: z.string(),
	notes: z.string().optional(),
	clock_out_time: z.string().optional(),
	date: z.string().optional(),
});

export type CreateAttendanceDto = z.infer<typeof createAttendanceDto>;
export type UpdateAttendanceDto = z.infer<typeof updateAttendanceDto>;
