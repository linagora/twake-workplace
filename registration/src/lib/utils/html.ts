import { debounce } from '$utils/timeout';

type ActionType = {
	destroy: () => void;
};

/**
 * Click outside svelte action.
 *
 * calls a handler when the user clicks outside 
 *
 * @param {HTMLElement} node - The node to listen to.
 * @param {Function} onEventFunction - The function to call when the event is triggered.
 * @example
 *  <div use:clickOutside={closeModal} />
 * @returns {ActionType}
 */
export const clickOutside = (node: HTMLElement, onEventFunction: () => void): ActionType => {
	const handleClick = (event: Event) => {
		const path = event.composedPath();

		if (!path.includes(node)) {
			onEventFunction();
		}
	};

	document.addEventListener('click', handleClick);

	return {
		destroy() {
			document.removeEventListener('click', handleClick);
		}
	};
};

/**
 * Stop typing svelte action.
 *
 * fires a custom event when the user stops typing after some delay.
 *
 * @param {HTMLElement} node - The node to listen to.
 * @example
 *  <input use:stopTyping on:stopTyping={typing} />
 * @returns {ActionType}
 */
export const stopTyping = (node: HTMLElement): ActionType => {
	const handler = debounce((event: Event) => {
		if (node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('stopTyping'));
		}
	});

	node.addEventListener('input', handler);

	return {
		destroy() {
			node.removeEventListener('input', handler);
		}
	};
};
