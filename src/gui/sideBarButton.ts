
import { detectNationStatesTheme } from "./identifyTheme";
import { Icon } from "./types";

/**
 * Adds a button to the sidebar panel of the NationStates interface.
 *
 * The sidebar is the vertical navigation panel on the left (inside `div#panel`).
 * Buttons are added to the main menu list (`ul.menu`).
 *
 * @param text The text label for the button.
 * @param iconClass The CSS class for the button's icon (e.g., "globe", "radar").
 * @param onClick A function to be called when the button is clicked.
 * @param href The URL the button should link to. Defaults to "#" for action-only buttons.
 * @returns The created list item element (HTMLLIElement) or null if a required container element is not found.
 */
export function addSidebarButton(
    text: string,
    iconClass: Icon,
    onClick: () => void,
    href: string = "#"
): HTMLLIElement | null {
    const theme = detectNationStatesTheme(document.documentElement.innerHTML)
    switch (theme) {
        // Call the Rift-specific implementation
        case "Rift":
            return addSideBarButtonRift(text, iconClass, onClick, href);
        case "Antiquity":
            console.log("Not implemented yet");
        case "Century":
            console.log("Not implemented yet");
        case "Mobile":
            console.log("Not implemented yet");
        case "None":
            console.log("Not implemented yet");
        case "Unknown":
            console.error("Something has gone very wrong.")
    }
    return null;
}

/**
 * Adds a button to the sidebar panel of the NationStates interface, specifically for the Rift theme.
 *
 * The sidebar is the vertical navigation panel on the left (inside `div#panel`).
 * Buttons are added to the main menu list (`ul.menu`).
 *
 * @param text The text label for the button.
 * @param iconClass The CSS class for the button's icon (e.g., "globe", "radar").
 * @param onClick A function to be called when the button is clicked.
 * @param href The URL the button should link to. Defaults to "#" for action-only buttons.
 * @returns The created list item element (HTMLLIElement) or null if a required container element is not found.
 */
function addSideBarButtonRift(
    text: string,
    iconClass: Icon,
    onClick: () => void,
    href: string = "#"
): HTMLLIElement | null {
    const panelContent = document.querySelector("#panel .panelcontent");
    if (!panelContent) {
        console.error("NationStates Button Helper: Panel content (div#panel .panelcontent) not found.");
        return null;
    }

    const mainMenu = panelContent.querySelector("ul.menu");
    if (!mainMenu) {
        console.error("NationStates Button Helper: Main menu (ul.menu) in sidebar not found.");
        return null;
    }

    // Create the button structure: <li><a><i class="..."></i><div class="paneltext">TEXT</div></a></li>
    const listItem = document.createElement("li");

    const linkElement = document.createElement("a");
    linkElement.href = href;
    if (href === "#") {
        linkElement.style.cursor = "pointer"; // Indicate it's clickable if it's an action button
    }


    const iconElement = document.createElement("i");
    iconElement.className = `icon-${iconClass}`;

    const panelTextDiv = document.createElement("div");
    panelTextDiv.className = "paneltext";
    panelTextDiv.textContent = text.toUpperCase();

    linkElement.appendChild(iconElement);
    linkElement.appendChild(panelTextDiv);

    linkElement.addEventListener("click", (e) => {
        if (href === "#") {
            e.preventDefault(); // Prevent default anchor action only if it's a JS action button
        }
        onClick();
    });

    listItem.appendChild(linkElement);

    // Insert before minor menu items for better grouping, or append if not found.
    const minorMenuItems = mainMenu.querySelector("#minormenuitems");
    if (minorMenuItems) {
        mainMenu.insertBefore(listItem, minorMenuItems);
    } else {
        mainMenu.appendChild(listItem);
    }

    return listItem;
}
