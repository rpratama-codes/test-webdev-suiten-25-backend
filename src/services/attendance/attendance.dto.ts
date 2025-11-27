import z from 'zod';

export const baseAttendanceDto = z.object({
	date: z.string(),
	clock_out_time: z.string().optional(),
	notes: z.string().optional(),
});

export const createAttendanceDto = baseAttendanceDto.extend({
	employee_id: z.string(),
	clock_out_time: z.string(),
});

export const createManyAttendanceDto = z.array(createAttendanceDto);

export const updateAttendanceDto = baseAttendanceDto.extend({
	id: z.string(),
});

export type CreateAttendanceDto = z.infer<typeof createAttendanceDto>;
export type UpdateAttendanceDto = z.infer<typeof updateAttendanceDto>;
