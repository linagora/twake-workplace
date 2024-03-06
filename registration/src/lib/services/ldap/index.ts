import client from './client';

export const init = async (): Promise<void> => {
  await client.initClient();
	await client.getClient();
};

export default client;
