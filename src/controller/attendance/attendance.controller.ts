import type { Request, Response } from 'express';
import {
	createManyAttendanceDto,
	updateAttendanceDto,
} from '../../services/attendance/attendance.dto.js';
import type { AttendanceService } from '../../services/attendance/attendance.service.js';
import { ControllerBase } from '../../utils/base-class/controller.class.js';

export class AttendanceController extends ControllerBase {
	constructor(private readonly attendanceService: AttendanceService) {
		super();
	}

	public async listAttendance(_req: Request, res: Response) {
		const attendance = await this.attendanceService.list();

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				attendance,
			},
		});
	}

	public async addAttendance(req: Request, res: Response) {
		const dto = await createManyAttendanceDto.parseAsync(req.body);
		const attendance = await this.attendanceService.createMany(dto);

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				attendance,
			},
		});
	}

	public async updateAttendance(req: Request, res: Response) {
		const dto = await updateAttendanceDto.parseAsync(req.body);
		const attendance = await this.attendanceService.updateById(dto);

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				attendance,
			},
		});
	}

	public async deleteAttendance(req: Request, res: Response) {
		const attendanceIds = req.params.attendanceIds;

		if (!attendanceIds) {
			throw this.errorSignal(400, 'Please set `attendanceIds`.');
		}

		const ids = attendanceIds.split(',');
		await this.attendanceService.deleteMany(ids);

		return this.sendApiResponse(res, {
			status: 204,
		});
	}
}
