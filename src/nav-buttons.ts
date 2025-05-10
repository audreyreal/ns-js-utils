import { Icon } from "./icons";

/**
 * Represents the possible positions for a top bar button.
 */
type TopBarButtonPosition = "left" | "right";

/**
 * Adds a button to the top bar of the NationStates interface.
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
function addTopBarButton(
    text: string,
    iconClass: Icon,
    onClick: () => void,
    position: TopBarButtonPosition = "right"
): HTMLDivElement | null {
    const banner = document.getElementById("banner");
    if (!banner) {
        console.error("NationStates Button Helper: Banner element (div#banner) not found.");
        return null;
    }

    // Create the button structure: <div class="bel"><div class="belcontent"><a class="bellink"><i class="..."></i>TEXT</a></div></div>
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "bel";

    const belContentDiv = document.createElement("div");
    belContentDiv.className = "belcontent";

    const linkElement = document.createElement("a");
    linkElement.className = "bellink";
    linkElement.href = "#"; // Prevent page navigation for non-link buttons
    linkElement.style.cursor = "pointer"; // Indicate it's clickable

    const iconElement = document.createElement("i");
    iconElement.className = iconClass; // e.g., "icon-star"

    linkElement.appendChild(iconElement);
    linkElement.appendChild(document.createTextNode(` ${text}`)); // Add a space before text if icon is present

    linkElement.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default anchor action
        onClick();
    });

    belContentDiv.appendChild(linkElement);
    buttonDiv.appendChild(belContentDiv);

    // Insert the button at the correct position
    const spacer = banner.querySelector("div.belspacer.belspacermain");

    if (position === "left") {
        if (spacer) {
            banner.insertBefore(buttonDiv, spacer);
        } else {
            // Fallback: if spacer isn't found (unlikely), append to banner.
            // This might not be perfectly "left" but better than not adding.
            console.warn("NationStates Button Helper: Top bar spacer (div.belspacer.belspacermain) not found for left positioning. Appending to banner.");
            banner.appendChild(buttonDiv);
        }
    } else if (position === "right") {
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
            console.error("NationStates Button Helper: Top bar spacer (div.belspacer.belspacermain) not found for right positioning.");
            return null; // Can't position right without the spacer
        }
    }

    return buttonDiv;
}

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
function addSidebarButton(
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
    panelTextDiv.textContent = text;

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

export { addTopBarButton, addSidebarButton };