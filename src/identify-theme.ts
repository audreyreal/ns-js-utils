/**
 * Enum representing the possible NationStates themes.
 */
type NationStatesTheme =
    | "Antiquity"
    | "Century"
    | "Rift"
    | "Mobile"
    | "None"
    | "Unknown";

/**
 * Analyzes the provided HTML content to detect the active NationStates theme.
 *
 * @param htmlContent - A string containing the HTML content of a NationStates page. Likely document.documentElement.innerHTML
 * @returns The detected NationStatesTheme.
 */
function detectNationStatesTheme(htmlContent: string): NationStatesTheme {
    // Check for Mobile theme (most specific CSS file name)
    // Mobile theme includes a stylesheet like: /ns.m_v1740624640.css
    if (htmlContent.includes('/ns.m_')) {
        return "Mobile";
    }

    // Check for Antiquity theme
    // Antiquity theme includes a stylesheet like: /ns.antiquity_v1745808370.css
    if (htmlContent.includes('/ns.antiquity_')) {
        return "Antiquity";
    }

    // Check for Century theme
    // Century theme includes a stylesheet like: /ns.century_v1681527181.css
    if (htmlContent.includes('/ns.century_')) {
        return "Century";
    }

    // Check for Rift (Default) theme
    // The Rift theme is the default. It uses the base NS stylesheet and has specific layout identifiers.
    // It must include the base stylesheet (e.g., /ns_v123.css)
    // AND specific structural elements like id="paneltitle" or class="bel bannernation".
    if (
        htmlContent.includes('/ns_v') &&
        (htmlContent.includes('id="paneltitle"') || htmlContent.includes('class="bel bannernation"'))
    ) {
        return "Rift";
    }

    // Check for Template-None theme
    // This theme has no NationStates-specific stylesheets at all.
    // This check comes after specific themes and Rift, as Rift *does* use /ns_v.
    // If it wasn't identified as Mobile, Antiquity, Century, or Rift,
    // and it lacks the base NS stylesheet and the common fontello stylesheet,
    // it's considered Template-None.
    if (!htmlContent.includes('/ns_v') && !htmlContent.includes('/fontello/')) {
        return "None";
    }

    // Fallback if no specific theme is detected, but it might still be an NS page
    // with an unrecognized theme or partial styling (e.g. has /ns_v but no Rift markers).
    return "Unknown";
}