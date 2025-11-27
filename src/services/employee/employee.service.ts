import { ServiceBase } from '../../utils/base-class/service.class.js';
import type { Employees, WorkPositions } from '../prisma/generated/client.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type { AddEmployeeDto, UpdateEmployeeDto } from './employee.dto.js';

export class EmployeeService extends ServiceBase {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	public async listEmployee() {
		return await this.prisma.employees.findMany();
	}

	public async getEmployeeById(employee_id: string) {
		return await this.prisma.employees.findFirst({
			where: {
				id: employee_id,
			},
			include: {
				workPositions: true,
				bank_name: true,
			},
		});
	}

	public async addEmployee({ employee, workPositionNameIds }: AddEmployeeDto) {
		return await this.prisma.$transaction(async (tx) => {
			const createdEmployee = await tx.employees.create({
				data: {
					...(employee as Employees),
				},
			});

			await tx.workPositions.createMany({
				data: workPositionNameIds.map((positionId) => {
					return {
						employee_id: createdEmployee.id,
						work_position_name_id: positionId,
					} satisfies Pick<
						WorkPositions,
						'employee_id' | 'work_position_name_id'
					>;
				}),
			});

			return createdEmployee;
		});
	}

	public async updateEmployee({
		employee,
		workPositionNameIds,
	}: UpdateEmployeeDto) {
		const { id, ...restEmployeePayload } = employee;

		const currentWorkPosition = await this.prisma.workPositions.findMany({
			where: {
				employee_id: id,
			},
			select: {
				work_position_name_id: true,
			},
		});

		const currentIds = currentWorkPosition.map(
			(cId) => cId.work_position_name_id,
		);

		const positionToAdd = workPositionNameIds.filter(
			(newId) => !currentIds.includes(newId),
		);
		const positionToDelete = currentIds.filter(
			(oldId) => !workPositionNameIds.includes(oldId),
		);

		const [updatedEmployee] = await Promise.all([
			this.prisma.employees.update({
				where: {
					id,
				},
				data: {
					...(restEmployeePayload as Employees),
				},
			}),
			this.prisma.workPositions.createMany({
				data: positionToAdd.map((positionId) => {
					return {
						employee_id: id,
						work_position_name_id: positionId,
					} satisfies Pick<
						WorkPositions,
						'employee_id' | 'work_position_name_id'
					>;
				}),
			}),
			this.prisma.workPositions.deleteMany({
				where: {
					employee_id: id,
					work_position_name_id: {
						in: positionToDelete,
					},
				},
			}),
		]);

		return updatedEmployee;
	}

	public async deleteEmployee(employee_id: string) {
		return await this.prisma.employees.delete({ where: { id: employee_id } });
	}
}
