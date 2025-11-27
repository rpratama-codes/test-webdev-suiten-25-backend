import type { Request, Response } from 'express';
import {
	addEmployeeDto,
	updateEmployeeDto,
} from '../../services/employee/employee.dto.js';
import type { EmployeeService } from '../../services/employee/employee.service.js';
import { ControllerBase } from '../../utils/base-class/controller.class.js';

export class EmployeeController extends ControllerBase {
	constructor(private readonly employeeService: EmployeeService) {
		super();
	}

	public async listEmployee(_req: Request, res: Response) {
		const employees = await this.employeeService.listEmployee();

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				employees,
			},
		});
	}

	public async getEmployeeById(req: Request, res: Response) {
		const employee_id = req.params.employeeId;

		if (!employee_id) {
			throw this.errorSignal(400, 'Please set `employeeId`.');
		}

		const employee = await this.employeeService.getEmployeeById(employee_id);

		return this.sendApiResponse(res, {
			status: 200,
			data: { employee },
		});
	}

	public async addEmployee(req: Request, res: Response) {
		const dto = await addEmployeeDto.parseAsync(req.body);
		const employee = await this.employeeService.addEmployee(dto);

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				employee,
			},
		});
	}

	public async updateEmployee(req: Request, res: Response) {
		const dto = await updateEmployeeDto.parseAsync(req.body);
		const employee = await this.employeeService.updateEmployee(dto);

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				employee,
			},
		});
	}

	public async deleteEmployee(req: Request, res: Response) {
		const employee_id = req.params.employeeId;

		if (!employee_id) {
			throw this.errorSignal(400, 'Please set `employeeId`.');
		}

		await this.employeeService.deleteEmployee(employee_id);

		return this.sendApiResponse(res, {
			status: 204,
		});
	}
}
