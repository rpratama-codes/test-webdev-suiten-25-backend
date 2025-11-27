import z from 'zod';

const employeeDto = z.object({
	name: z.string('Name not allow to be empty!.'),
	phone_number: z.string().optional(),
	bank_account_name: z.string().optional(),
	bank_account_number: z.string().optional(),
	bank_name_id: z.string().optional(),
	salary: z.number().optional(),
	salary_payment_periode: z.string().optional(),
	salary_daily: z.number().optional(),
	allowance_holiday: z.number().optional(),
	allowance_meal: z.number().optional(),
	overtime_rate: z.number().optional(),
	overtime_holiday_rate: z.number().optional(),
});

export const addEmployeeDto = z.object({
	employee: employeeDto,
	workPositionNameIds: z.array(z.string()),
});

export const updateEmployeeDto = z.object({
	employee: employeeDto.extend({
		id: z.string(),
		name: z.string().optional(),
	}),
	workPositionNameIds: z.array(z.string()),
});

export type AddEmployeeDto = z.infer<typeof addEmployeeDto>;

export type UpdateEmployeeDto = z.infer<typeof updateEmployeeDto>;
