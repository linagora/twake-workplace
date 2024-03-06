import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json({
		uptime: process.uptime() * 1000,
		responseTime: process.hrtime(),
		message: 'OK',
		timestamp: Date.now()
	});
};
