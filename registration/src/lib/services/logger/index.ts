import { Logger } from 'tslog';

const logger = new Logger({
	name: 'registration-logger',
	type: 'pretty',
	hideLogPositionForProduction: true
});

export default logger;
