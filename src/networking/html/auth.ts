/**
 * Extracts the nation name from the body's data-nname attribute in the given Document.
 * @param doc The Document to extract from
 * @returns The nation name or null if not found
 */
function extractNation(doc: Document): string | null {
	return doc.body?.getAttribute("data-nname") || null;
}

/**
 * Extracts the chk value from the hidden input with name="chk" in the given Document.
 * @param doc The Document to extract from
 * @returns The chk value or null if not found
 */
function extractChk(doc: Document): string | null {
	const chkInput = doc.querySelector(
		'input[name="chk"]',
	) as HTMLInputElement | null;
	return chkInput?.value || null;
}

/**
 * Extracts the localid value from the hidden input with name="localid" in the given Document.
 * @param doc The Document to extract from
 * @returns The localid value or null if not found
 */
function extractLocalid(doc: Document): string | null {
	const localidInput = doc.querySelector(
		'input[name="localid"]',
	) as HTMLInputElement | null;
	return localidInput?.value || null;
}

/**
 * Stores nation, chk, and localid from the given Document in localStorage.
 * @param doc The Document to extract auth data from
 */
export default function storeAuth(doc: Document): void {
	const nation = extractNation(doc);
	const chk = extractChk(doc);
	const localid = extractLocalid(doc);

	if (nation) {
		try {
			localStorage.setItem("lastKnownNation", nation);
		} catch (error) {
			console.error("Error storing lastKnownNation to localStorage:", error);
		}
	}

	if (chk) {
		try {
			localStorage.setItem("lastKnownChk", chk);
		} catch (error) {
			console.error("Error storing lastKnownChk to localStorage:", error);
		}
	}

	if (localid) {
		try {
			localStorage.setItem("lastKnownLocalid", localid);
		} catch (error) {
			console.error("Error storing lastKnownLocalid to localStorage:", error);
		}
	}
}

if (typeof window !== "undefined") {
	window.addEventListener("load", () => {
		storeAuth(document);
	});
}
