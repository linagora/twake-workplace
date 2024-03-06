import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json({
		uptime: process.uptime(),
		responseTime: process.hrtime(),
		message: 'OK',
		timestamp: Date.now()
	});
};
