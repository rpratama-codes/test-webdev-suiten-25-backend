import express, { type Request, type Response } from 'express';
import { WorkPositionController } from '../../controller/work-position/work-position.controller.js';
import { PrismaService } from '../../services/prisma/prisma.service.js';
import { WorkPositionsService } from '../../services/work-position/work-position.service.js';
import { HappyRouter } from '../../utils/base-class/happy-router.js';
import { happyLogger } from '../../utils/logger/winston.js';

const router = express.Router();
const prismaService = new PrismaService();
const workPositionsService = new WorkPositionsService(prismaService);
const workPositionsController = new WorkPositionController(
	workPositionsService,
);

const happyRouter = new HappyRouter({
	expressRouter: router,
	prefix: '/positions',
	callbackLogger: happyLogger,
	routes: [
		{
			path: '/',
			method: 'get',
			handlers: [
				async (req: Request, res: Response) =>
					await workPositionsController.listPositionNames(req, res),
			],
		},
		{
			path: '/',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await workPositionsController.addPositionName(req, res),
			],
		},
		{
			path: '/',
			method: 'patch',
			handlers: [
				async (req: Request, res: Response) =>
					await workPositionsController.updatePositionName(req, res),
			],
		},
		{
			path: '/:positionNameId',
			method: 'delete',
			handlers: [
				async (req: Request, res: Response) =>
					await workPositionsController.deletePositionName(req, res),
			],
		},
	],
});

export const workPositionRoute = happyRouter.compass();
