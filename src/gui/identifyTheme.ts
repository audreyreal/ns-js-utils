import type { NationStatesTheme } from "./types";

/**
 * Analyzes the provided HTML content to detect the active NationStates theme.
 *
 * @param doc - The Document object of a NationStates page.
 * @returns The detected NationStatesTheme.
 */
export function detectNationStatesTheme(doc: Document): NationStatesTheme {
	const stylesheets = Array.from(
		doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
	).map((link) => link.href);

	const hasStylesheet = (substring: string): boolean =>
		stylesheets.some((href) => href.includes(substring));

	// Check for Mobile theme (most specific CSS file name)
	// Mobile theme includes a stylesheet like: /ns.m_v1740624640.css
	if (hasStylesheet("/ns.m_")) {
		return "Mobile";
	}

	// Check for Antiquity theme
	// Antiquity theme includes a stylesheet like: /ns.antiquity_v1745808370.css
	if (hasStylesheet("/ns.antiquity_")) {
		return "Antiquity";
	}

	// Check for Century theme
	// Century theme includes a stylesheet like: /ns.century_v1681527181.css
	if (hasStylesheet("/ns.century_")) {
		return "Century";
	}

	// Check for Rift (Default) theme
	// The Rift theme is the default. It uses the base NS stylesheet and has specific layout identifiers.
	// It must include the base stylesheet (e.g., /ns_v123.css)
	// AND specific structural elements like id="paneltitle" or class="bel bannernation".
	const hasBaseStylesheet = hasStylesheet("/ns_v");
	const hasRiftPanel = doc.getElementById("panel");

	if (hasBaseStylesheet && hasRiftPanel) {
		return "Rift";
	}

	// Check for Template-None theme
	const hasFontelloStylesheet = hasStylesheet("/fontello/");
	if (!hasBaseStylesheet && !hasFontelloStylesheet) {
		return "None";
	}

	// Fallback if no specific theme is detected, but it might still be an NS page
	// with an unrecognized theme or partial styling (e.g. has /ns_v but no Rift markers).
	return "Unknown";
}
