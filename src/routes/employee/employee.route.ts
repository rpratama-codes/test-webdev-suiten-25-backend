import express, { type Request, type Response } from 'express';
import { EmployeeController } from '../../controller/employee/employee.controller.js';
import { EmployeeService } from '../../services/employee/employee.service.js';
import { PrismaService } from '../../services/prisma/prisma.service.js';
import { HappyRouter } from '../../utils/base-class/happy-router.js';
import { happyLogger } from '../../utils/logger/winston.js';

const router = express.Router();
const prismaService = new PrismaService();
const employeeService = new EmployeeService(prismaService);
const employeeController = new EmployeeController(employeeService);

const happyRouter = new HappyRouter({
	expressRouter: router,
	prefix: '/employees',
	callbackLogger: happyLogger,
	routes: [
		{
			path: '/',
			method: 'get',
			middlewares: [],
			handlers: [
				async (req: Request, res: Response) =>
					await employeeController.listEmployee(req, res),
			],
		},
		{
			path: '/',
			method: 'post',
			middlewares: [],
			handlers: [
				async (req: Request, res: Response) =>
					await employeeController.addEmployee(req, res),
			],
		},
		{
			path: '/',
			method: 'patch',
			middlewares: [],
			handlers: [
				async (req: Request, res: Response) =>
					await employeeController.updateEmployee(req, res),
			],
		},
		{
			path: '/:employeeId',
			method: 'delete',
			middlewares: [],
			handlers: [
				async (req: Request, res: Response) =>
					await employeeController.deleteEmployee(req, res),
			],
		},
	],
});

export const employeeRoute = happyRouter.compass();
