import { detectNationStatesTheme } from "./identifyTheme";
import type { Icon, TopBarButtonPosition } from "./types";

/**
 * Adds a button to the top bar of the NationStates interface, detecting the correct theme and position.
 *
 * The top bar is the horizontal bar at the very top of the page (inside `div#banner`).
 * Buttons can be anchored to the left or right of the central spacer element.
 *
 * @param text The text label for the button.
 * @param iconClass The CSS class for the button's icon (e.g., "globe", "radar").
 * @param onClick A function to be called when the button is clicked.
 * @param position Where to place the button in the top bar: "left" or "right".
 * @returns The created button element (HTMLDivElement) or null if a required container element is not found.
 */
export function addTopBarButton(
	text: string,
	iconClass: Icon,
	onClick: () => void,
	position: TopBarButtonPosition = "right",
): HTMLDivElement | null {
	const theme = detectNationStatesTheme(document);
	switch (theme) {
		// Call the Rift-specific implementation
		case "Rift":
			return addTopBarButtonRift(text, iconClass, onClick, position);
		case "Antiquity":
			console.log("Not implemented yet");
			return null;
		case "Century":
			console.log("Not implemented yet");
			return null;
		case "Mobile":
			console.log("Not implemented yet");
			return null;
		case "None":
			console.log("Not implemented yet");
			return null;
		case "Unknown":
			console.error("Something has gone very wrong.");
			return null;
	}
}
/**
 * Adds a button to the top bar of the NationStates interface, specifically for the Rift theme.
 *
 * The top bar is the horizontal bar at the very top of the page (inside `div#banner`).
 * Buttons can be anchored to the left or right of the central spacer element.
 *
 * @param text The text label for the button.
 * @param iconClass The CSS class for the button's icon (e.g., "globe", "radar").
 * @param onClick A function to be called when the button is clicked.
 * @param position Where to place the button in the top bar: "left" or "right".
 * @returns The created button element (HTMLDivElement) or null if a required container element is not found.
 */
function addTopBarButtonRift(
	text: string,
	iconClass: Icon,
	onClick: () => void,
	position: TopBarButtonPosition = "right",
): HTMLDivElement | null {
	const banner = document.getElementById("banner");
	if (!banner) {
		console.error(
			"NationStates Button Helper: Banner element (div#banner) not found.",
		);
		return null;
	}

	// Create the button structure: <div class="bel"><div class="belcontent"><a class="bellink"><i class="..."></i>TEXT</a></div></div>
	const buttonDiv = document.createElement("div");
	buttonDiv.className = "bel";

	const belContentDiv = document.createElement("div");
	belContentDiv.className = "belcontent";

	const linkElement = document.createElement("a");

	// Apply background, padding, and color if on welcome page
	if (document.getElementById("welcomelinks")) {
		linkElement.style.background = "rgba(255,255,255,0.7)";
		linkElement.style.padding = "4px 18px";
		linkElement.style.color = "#000";
	}
	linkElement.className = "bellink";
	linkElement.href = "#"; // Prevent page navigation for non-link buttons
	linkElement.style.cursor = "pointer"; // Indicate it's clickable

	const iconElement = document.createElement("i");
	iconElement.className = `icon-${iconClass}`;

	linkElement.appendChild(iconElement);
	linkElement.appendChild(document.createTextNode(` ${text.toUpperCase()}`)); // Add a space before text if icon is present

	linkElement.addEventListener("click", (e) => {
		e.preventDefault(); // Prevent default anchor action
		onClick();
	});

	belContentDiv.appendChild(linkElement);
	buttonDiv.appendChild(belContentDiv);

	// Insert the button at the correct position
	const spacer = banner.querySelector("div.belspacer.belspacermain");

	if (position === "right" || document.body.id === "loggedout") {
		if (spacer) {
			// Right-aligned buttons go inside the 'belspacermain' container,
			// typically before the "SWITCH" or "LOGOUT" buttons.
			const loginSwitcher = spacer.querySelector("#loginswitcher");
			if (loginSwitcher) {
				spacer.insertBefore(buttonDiv, loginSwitcher);
			} else {
				// If login switcher isn't there (e.g., logged out, or different layout),
				// try to insert before the logout box or just append to the spacer.
				const logoutBox = spacer.querySelector("#logoutbox")?.parentElement; // logoutbox is inside a 'bel' div
				if (logoutBox) {
					spacer.insertBefore(buttonDiv, logoutBox);
				} else {
					spacer.appendChild(buttonDiv); // Append to the spacer container
				}
			}
		} else {
			console.error(
				"NationStates Button Helper: Top bar spacer (div.belspacer.belspacermain) not found for right positioning.",
			);
			return null; // Can't position right without the spacer
		}
	} else if (position === "left") {
		if (spacer) {
			banner.insertBefore(buttonDiv, spacer);
		} else {
			// Fallback: if spacer isn't found (unlikely), append to banner.
			// This might not be perfectly "left" but better than not adding.
			console.warn(
				"NationStates Button Helper: Top bar spacer (div.belspacer.belspacermain) not found for left positioning. Appending to banner.",
			);
			banner.appendChild(buttonDiv);
		}
	} else {
		console.error(
			`NationStates Button Helper: Invalid position "${position}" provided. Must be "left" or "right".`,
		);
		return null;
	}

	return buttonDiv;
}
