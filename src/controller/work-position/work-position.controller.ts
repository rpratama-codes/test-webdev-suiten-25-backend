import type { Request, Response } from 'express';
import {
	addPositionNameDto,
	updatePositionNameDto,
} from '../../services/work-position/work-position.dto.js';
import type { WorkPositionsService } from '../../services/work-position/work-position.service.js';
import { ControllerBase } from '../../utils/base-class/controller.class.js';

export class WorkPositionController extends ControllerBase {
	constructor(private readonly workPositionService: WorkPositionsService) {
		super();
	}

	public async listPositionNames(_req: Request, res: Response) {
		const positions = await this.workPositionService.list();

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				positions,
			},
		});
	}

	public async getPositionNameById(req: Request, res: Response) {
		const positionNameId = req.params.positionNameId;

		if (!positionNameId) {
			throw this.errorSignal(400, 'Please set `positionNameId`.');
		}

		const position = await this.workPositionService.getById(positionNameId);

		return this.sendApiResponse(res, {
			status: 200,
			data: { position },
		});
	}

	public async addPositionName(req: Request, res: Response) {
		const dto = await addPositionNameDto.parseAsync(req.body);
		const position = await this.workPositionService.create(dto);

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				position,
			},
		});
	}

	public async updatePositionName(req: Request, res: Response) {
		const dto = await updatePositionNameDto.parseAsync(req.body);
		const position = await this.workPositionService.update(dto);

		return this.sendApiResponse(res, {
			status: 200,
			data: {
				position,
			},
		});
	}

	public async deletePositionName(req: Request, res: Response) {
		const positionNameId = req.params.positionNameId;

		if (!positionNameId) {
			throw this.errorSignal(400, 'Please set `positionNameId`.');
		}

		await this.workPositionService.deleteById(positionNameId);

		return this.sendApiResponse(res, {
			status: 204,
		});
	}
}
