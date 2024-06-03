/**
 * Debounce function
 *
 * @param fn Function to debounce
 * @param waitFor Time to wait before executing the function
 *
 * @example
 *   const fn = () => console.log('Debounced!');
 *   const debounced = debounce(fn, 1000);
 */
export const debounce = <Params extends unknown[]>(
	fn: (...args: Params) => void,
	waitFor = 800
) => {
	let timer: NodeJS.Timeout;

	return (...args: Params) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), waitFor);
	};
};
