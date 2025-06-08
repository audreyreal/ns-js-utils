import type { ApplyToWorldAssemblyFormData } from "../types";
import { prettify, type NSScript } from "../../../nsdotjs";

/**
 * Attempts to apply to or reapply to the World Assembly.
 * @param context The NSScript instance
 * @param reapply Whether to reapply to the World Assembly if you've already recently applied
 * @returns A Promise that resolves to true if the application is successful, false otherwise.
 */
export async function handleApply(
	context: NSScript,
	reapply?: boolean,
): Promise<boolean> {
	let payload: ApplyToWorldAssemblyFormData;
	if (reapply) {
		payload = {
			action: "join_UN",
			resend: "1",
		};
	} else {
		payload = {
			action: "join_UN",
			submit: "1",
		};
	}

	const text = await context.getNsHtmlPage("page=UN_Status", payload);
	if (
		text.includes(
			"Your application to join the World Assembly has been received!",
		)
	) {
		context.statusBubble.success("Applied to World Assembly");
		return true;
	}
	context.statusBubble.warn("Failed to apply to World Assembly");
	return false;
}

/**
 * Attempts to join the World Assembly as a member.
 * @param context The NSScript instance
 * @param nationName The name of the nation to join as.
 * @param appId The application ID for the nation.
 * @returns A Promise that resolves to true if the join is successful, false otherwise.
 */
export async function handleJoin(
	context: NSScript,
	nationName: string,
	appId: string,
): Promise<boolean> {
	const text = await context.getNsHtmlPage("cgi-bin/", {
		nation: nationName,
		appid: appId.trim(),
	});
	if (text.includes("Welcome to the World Assembly, new member ")) {
		context.statusBubble.success(
			`Joined World Assembly as ${prettify(nationName)}`,
		);
		return true;
	}
	context.statusBubble.warn("Failed to join World Assembly");
	return false;
}

/**
 * Attempts to resign from the World Assembly.
 * @returns A Promise that resolves to true if the resignation is successful, false otherwise.
 */
export async function handleResign(context: NSScript): Promise<boolean> {
	const text = await context.getNsHtmlPage("page=UN_Status", {
		action: "leave_UN",
		submit: "1",
	});
	if (
		text.includes("From context moment forward, your nation is on its own.")
	) {
		context.statusBubble.success("Resigned from World Assembly");
		return true;
	}
	context.statusBubble.warn("Failed to resign from World Assembly");
	return false;
}
