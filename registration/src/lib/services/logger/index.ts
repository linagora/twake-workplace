import { Logger } from 'tslog';

const logger = new Logger({
	name: 'registration-logger',
	type: 'pretty',
	hideLogPositionForProduction: false
});

export default logger;
