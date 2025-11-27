import { ServiceBase } from '../../utils/base-class/service.class.js';
import type {
	Attendance,
	AttendanceTimes,
} from '../prisma/generated/client.js';
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
		return await this.prisma.attendanceTimes.findMany({
			include: {
				employee: {
					select: {
						name: true,
						workPositions: {
							select: {
								work_position_name: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				},
				attendance: true,
			},
		});
	}

	public async createMany(dto: CreateAttendanceDto[]) {
		const attendanceData = dto.map((data) => {
			return {
				clock_out_time: new Date(data.time),
				date: data.date as unknown as Date,
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

	// NOT TESTED
	public async updateById(dto: UpdateAttendanceDto) {
		const updateData = dto as unknown as Partial<Attendance>;

		return await this.prisma.attendance.update({
			where: {
				id: dto.id,
			},
			data: updateData,
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
