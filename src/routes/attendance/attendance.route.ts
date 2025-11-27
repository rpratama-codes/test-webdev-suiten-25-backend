import express, { type Request, type Response } from 'express';
import { AttendanceController } from '../../controller/attendance/attendance.controller.js';
import { AttendanceService } from '../../services/attendance/attendance.service.js';
import { PrismaService } from '../../services/prisma/prisma.service.js';
import { HappyRouter } from '../../utils/base-class/happy-router.js';
import { happyLogger } from '../../utils/logger/winston.js';

const router = express.Router();
const prismaService = new PrismaService();
const attendanceService = new AttendanceService(prismaService);
const attendanceController = new AttendanceController(attendanceService);

const happyRouter = new HappyRouter({
	expressRouter: router,
	prefix: '/attendance',
	callbackLogger: happyLogger,
	routes: [
		{
			path: '/',
			method: 'get',
			handlers: [
				async (req: Request, res: Response) =>
					await attendanceController.listAttendance(req, res),
			],
		},
		{
			path: '/',
			method: 'post',
			handlers: [
				async (req: Request, res: Response) =>
					await attendanceController.addAttendance(req, res),
			],
		},
		{
			path: '/',
			method: 'patch',
			handlers: [
				async (req: Request, res: Response) =>
					await attendanceController.updateAttendance(req, res),
			],
		},
		{
			path: '/:attendanceIds',
			method: 'delete',
			handlers: [
				async (req: Request, res: Response) =>
					await attendanceController.deleteAttendance(req, res),
			],
		},
	],
});

export const attendanceRoute = happyRouter.compass();
