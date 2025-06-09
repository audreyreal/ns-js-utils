import {
	canonicalize,
	type MoveRegionFormData,
	type NSScript,
	prettify,
} from "../../../nsdotjs";

/**
 * Attempts to move the current nation to a different region.
 * @param context The NSScript instance
 * @param regionName The name of the region to move to.
 * @param password Optional password for the region.
 * @returns A Promise that resolves to true if the move is successful, false otherwise.
 */
export async function handleMove(
	context: NSScript,
	regionName: string,
	password?: string,
): Promise<boolean> {
	const payload: MoveRegionFormData = {
		region_name: regionName,
		move_region: "1",
	};
	if (password) {
		payload.password = password;
	}
	const text = await context.getNsHtmlPage("page=change_region", payload);
	if (text.includes("Success!")) {
		context.statusBubble.success(`Moved to region: ${prettify(regionName)}`);
		return true;
	}
	context.statusBubble.warn(
		`Failed to move to region: ${prettify(regionName)}`,
	);
	return false;
}

/**
 * Attempts to create a new region.
 * @param context The NSScript instance
 * @param regionName The name of the region to create.
 * @param wfe The World Factbook Entry for the region.
 * @param password Optional password for the region.
 * @param frontier Whether the region is a frontier region. Optional, defaults to false.
 * @param executiveDelegate Whether the region has an executive delegate. Optional, defaults to false.
 * @returns A Promise that resolves to true if the creation is successful, false otherwise.
 */
export async function handleCreate(
	context: NSScript,
	regionName: string,
	wfe: string,
	password = "",
	frontier = false,
	executiveDelegate = false,
): Promise<boolean> {
	const payload: Record<string, string> = {
		region_name: canonicalize(regionName),
		desc: wfe,
		create_region: "1",
		is_frontier: frontier ? "1" : "0",
		delegate_control: executiveDelegate ? "1" : "0",
	};
	if (password) {
		payload.pw = "1";
		payload.rpassword = password;
	}
	const text = await context.getNsHtmlPage("page=create_region", payload);
	if (text.includes("Success! You have founded ")) {
		context.statusBubble.success(`Created region: ${prettify(regionName)}`);
		return true;
	}
	context.statusBubble.warn(`Failed to create region: ${prettify(regionName)}`);
	return false;
}

export async function handleChangeWFE(context: NSScript, wfe: string) {
	const text = await context.getNsHtmlPage("page=region_control", {
		message: wfe.trim(),
		setwfebutton: "1",
	});
	if (text.includes("World Factbook Entry updated!")) {
		context.statusBubble.success("World Factbook Entry updated!");
		return true;
	}
	context.statusBubble.warn("Failed to update World Factbook Entry.");
	return false;
}

export async function handleRequestEmbassy(context: NSScript, target: string) {
	const text = await context.getNsHtmlPage("page=region_control", {
		requestembassyregion: target,
		requestembassy: "1",
	});
	if (text.includes("Your proposal for the construction of embassies with")) {
		context.statusBubble.success(`Requested embassy with ${prettify(target)}`);
		return true;
	}
	context.statusBubble.warn(
		`Failed to request embassy with ${prettify(target)}`,
	);
	return false;
}

export async function handleCloseEmbassy(context: NSScript, target: string) {
	const text = await context.getNsHtmlPage("page=region_control", {
		cancelembassyregion: target,
	});
	if (text.includes(" has been scheduled for demolition.")) {
		context.statusBubble.success(`Burned embassy with ${prettify(target)}`);
		return true;
	}
	context.statusBubble.warn(`Failed to burn embassy with ${prettify(target)}`);
	return false;
}

export async function handleAbortEmbassy(context: NSScript, target: string) {
	const text = await context.getNsHtmlPage("page=region_control", {
		abortembassyregion: target,
	});
	if (text.includes(" aborted.")) {
		context.statusBubble.success(`Aborted embassy with ${prettify(target)}`);
		return true;
	}
	context.statusBubble.warn(`Failed to abort embassy with ${prettify(target)}`);
	return false;
}

export async function handleCancelEmbassyClosure(context: NSScript, target: string) {
	const text = await context.getNsHtmlPage("page=region_control", {
		cancelembassyclosureregion: target,
	});
	if (text.includes("Embassy closure order cancelled.")) {
		context.statusBubble.success(`Cancelled embassy closure with ${prettify(target)}`);
		return true;
	}
	context.statusBubble.warn(`Failed to cancel embassy closure with ${prettify(target)}`);
	return false;
}

export async function eject(
	context: NSScript,
	nationName: string,
): Promise<boolean> {
	const text = await context.getNsHtmlPage("page=region_control", {
		nation_name: nationName,
		eject: "1",
	});
	if (text.includes("has been ejected from ")) {
		context.statusBubble.success(`Ejected nation: ${prettify(nationName)}`);
		return true;
	}
	context.statusBubble.warn(`Failed to eject nation: ${prettify(nationName)}`);
	return false;
}

export async function banject(
	context: NSScript,
	nationName: string,
): Promise<boolean> {
	const text = await context.getNsHtmlPage("page=region_control", {
		nation_name: nationName,
		ban: "1",
	});
	if (text.includes("has been ejected and banned from ")) {
		context.statusBubble.success(`Banjected nation: ${prettify(nationName)}`);
		return true;
	}
	context.statusBubble.warn(`Failed to banject nation: ${prettify(nationName)}`);
	return false;
}

// TODO: add adding tags to regions, as well as uploading flags/banners, as well as detag wfe's from pauls website