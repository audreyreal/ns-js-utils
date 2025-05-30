/**
 * Type representing the formdata for moving to a region.
 */
type MoveRegionFormData = {
    region_name: string;
    password?: string;
    move_region: "1";
};

/**
 * Type representing the formdata for applying to the World Assembly.
 */
type ApplyToWorldAssemblyFormData = {
    action: "join_UN"
    submit?: "1"
    resend?: "1";
}

/**
 * Type representing the possible NationStates themes.
 */
type NationStatesTheme =
    | "Antiquity"
    | "Century"
    | "Rift"
    | "Mobile"
    | "None"
    | "Unknown";

/**
 * Represents the possible positions of top bar buttons.
 */
type TopBarButtonPosition = "left" | "right";

/**
 * Represents the possible icons available for the NationStates interface.
 * Comprehensive list of all icons can be found at: https://www.nationstates.net/page=dispatch/id=1625339
 * the codes (e.g. e83c, e83e) underneath the names should be ignored
 */
type Icon =
    | "align-left"
    | "chat-empty"
    | "login"
    | "flag-empty"
    | "star"
    | "mic"
    | "globe"
    | "book"
    | "gift"
    | "building"
    | "radar"
    | "mail"
    | "right-hand"
    | "cog-alt"
    | "male"
    | "megaphone"
    | "lock"
    | "link-ext"
    | "help"
    | "heart"
    | "rss-1"
    | "award"
    | "flash"
    | "chart-bar"
    | "shield"
    | "logout"
    | "newspaper"
    | "town-hall"
    | "monument"
    | "star-empty"
    | "link"
    | "search"
    | "wa"
    | "flag-1"
    | "heart-empty"
    | "mail-alt"
    | "comment"
    | "chat"
    | "bell"
    | "bell-alt"
    | "menu"
    | "lightbulb"
    | "arrows-cw"
    | "chart-bar-1"
    | "plus"
    | "coffee"
    | "globe-1"
    | "news"
    | "ok-circled"
    | "target-1"
    | "lock-open"
    | "chart-area"
    | "chart-line"
    | "female"
    | "target"
    | "award-1"
    | "chart"
    | "brain"
    | "radioactive"
    | "biohazard"
    | "doc"
    | "satellite"
    | "missile-inc"
    | "bombs"
    | "missile"
    | "clock"
    | "block"
    | "spin5"
    | "basket"
    | "cards"
    | "crown"
    | "key"
    | "wonders"
    | "resource"
    | "beaker"
    | "docs"
    | "doc-inv"
    | "map"
