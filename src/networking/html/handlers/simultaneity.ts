import type { NSScript } from "../../../nsdotjs";

export async function handleCheck(context: NSScript): Promise<boolean> {
	if (context.isHtmlRequestInProgress) {
		context.statusBubble.warn("Another request is already in progress.");
		return Promise.reject(
			new Error(
				"Simultaneous request denied: Another request is already in progress.",
			),
		);
	}
	context.isHtmlRequestInProgress = true;
	return true;
}

export function handleUnlock(context: NSScript): void {
	// Re-enable all submit buttons after the request is complete
	for (const btn of document.querySelectorAll<HTMLButtonElement>(
		'button[type="submit"]',
	)) {
		btn.disabled = false;
	}
	context.isHtmlRequestInProgress = false;
}

export function handleLock(context: NSScript): void {
	// Disable all submit buttons to enforce simultaneity
	for (const btn of document.querySelectorAll<HTMLButtonElement>(
		'button[type="submit"]',
	)) {
		btn.disabled = true;
	}
	context.isHtmlRequestInProgress = true;
}
