/**
 * Copy a text to clipboard
 *
 * @param {string} text - the text to copy.
 * @returns { Promise<void>}
 */
export const copyToClipboard = (text: string): Promise<void> => {
	return navigator.clipboard.writeText(text);
};
