import { ServiceBase } from '../../utils/base-class/service.class.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type {
	AddPositionNameDto,
	UpdatePositionNameDto,
} from './work-position.dto.js';

export class WorkPositionsService extends ServiceBase {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	public async create(dto: AddPositionNameDto) {
		return await this.prisma.workPositionNames.create({
			data: dto,
		});
	}

	public async list() {
		return await this.prisma.workPositionNames.findMany({
			select: {
				id: true,
				name: true,
				_count: {
					select: {
						workPositions: true,
					},
				},
			},
		});
	}

	public async getById(positionNameId: string) {
		return await this.prisma.workPositionNames.findFirst({
			where: {
				id: positionNameId,
			},
		});
	}

	public async update({ id, name }: UpdatePositionNameDto) {
		return await this.prisma.workPositionNames.update({
			where: {
				id,
			},
			data: {
				...(name ? { name } : {}),
			},
		});
	}

	public async deleteById(positionNameId: string) {
		return await this.prisma.workPositionNames.delete({
			where: {
				id: positionNameId,
			},
		});
	}
}
