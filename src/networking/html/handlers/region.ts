import { prettify, type NSScript, type MoveRegionFormData } from "../../../nsdotjs";

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
    context.statusBubble.warn(`Failed to move to region: ${prettify(regionName)}`);
    return false;
}