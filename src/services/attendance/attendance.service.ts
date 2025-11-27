import { ServiceBase } from '../../utils/base-class/service.class.js';
import type {
	Attendance,
	AttendanceTimes,
} from '../prisma/generated/client.js';
import type { AttendanceUncheckedUpdateInput } from '../prisma/generated/models.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type {
	CreateAttendanceDto,
	UpdateAttendanceDto,
} from './attendance.dto.js';

export class AttendanceService extends ServiceBase {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	public async list() {
		// TODO : add filter

		const employees = await this.prisma.employees.findMany({
			select: {
				name: true,
				attendances: true,
				workPositions: {
					select: {
						work_position_name: true,
					},
				},
			},
		});

		return employees;
	}

	public async createMany(dto: CreateAttendanceDto[]) {
		console.log(dto);
		const attendanceData = dto.map((data) => {
			return {
				clock_out_time: new Date(data.clock_out_time),
				date: new Date(data.date),
				employee_id: data.employee_id,
			} satisfies Pick<Attendance, 'clock_out_time' | 'date' | 'employee_id'>;
		});

		return await this.prisma.$transaction(async (tx) => {
			const attendance = await tx.attendance.createManyAndReturn({
				data: attendanceData,
			});

			const attendanceTimesData = attendance.map((att) => {
				return {
					attendance_id: att.id,
					employee_id: att.employee_id,
				} satisfies Pick<AttendanceTimes, 'attendance_id' | 'employee_id'>;
			});

			await tx.attendanceTimes.createMany({
				data: attendanceTimesData,
			});

			return attendance;
		});
	}

	public async updateById(dto: UpdateAttendanceDto) {
		return await this.prisma.attendance.update({
			where: {
				id: dto.id,
			},
			data: {
				...(dto as AttendanceUncheckedUpdateInput),
			},
		});
	}

	public async deleteMany(attendanceIds: string[]) {
		return await this.prisma.attendance.deleteMany({
			where: {
				id: {
					in: attendanceIds,
				},
			},
		});
	}
}
