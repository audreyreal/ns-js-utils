import { type NSScript, canonicalize, prettify } from "../../../nsdotjs";

/**
 * Attempts to create a new nation in the specified region.
 * @param context The NSScript instance
 * @param nationName The name of the nation to create.
 * @param password Optional password for the nation.
 * @returns A Promise that resolves to true if the creation is successful, false otherwise.
 */
export async function handleRestore(
	context: NSScript,
	nationName: string,
	password: string,
): Promise<boolean> {
	const response = await context.makeNsHtmlRequest(
		"",
		{
			logging_in: "1",
			restore_password: password,
			restore_nation: "1",
			nation: nationName,
		},
		false,
	);
	if (response.status === 302) {
		context.statusBubble.success(
			`Successfully restored nation: ${prettify(nationName)}\nYou need to re-authenticate to perform actions on this nation.`,
		);
		return true;
	}
	context.statusBubble.warn(
		`Failed to restore nation: ${prettify(nationName)}`,
	);
	return false;
}

/**
 * Attempts to log in to a NationStates nation.
 * @param context The NSScript instance
 * @param nationName The name of the nation to log in to.
 * @param password The password for the nation.
 * @returns A Promise that resolves to true if login is successful, false otherwise.
 */
export async function handleLogin(
	context: NSScript,
	nationName: string,
	password: string,
): Promise<boolean> {
	const text = await context.getNsHtmlPage("page=display_region", {
		region: "rwby",
		nation: nationName,
		password: password,
		logging_in: "1",
		submit: "Login",
	});
	const canonNation = canonicalize(nationName);
	const re = /(?<=Move )(.*?)(?= to RWBY!)/; // This regex captures the nation name in the "Move [Nation] to RWBY!" button
	const match = text.match(re);
	if (match && canonicalize(match[0]) === canonNation) {
		// Check if the nation name in the button matches the input nation
		context.statusBubble.success(
			`Logged in to nation: ${prettify(nationName)}`,
		);
		return true;
	}
	context.statusBubble.warn(
		`Failed to log in to nation: ${prettify(nationName)}`,
	);
	return false;
}
