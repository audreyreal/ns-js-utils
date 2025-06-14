import { NSScript } from "./client";
import { addTopBarButton } from "./gui/topBarButton";
import { addSidebarButton } from "./gui/sideBarButton";
import { prettify, canonicalize } from "./helpers";
export type { StatusBubble } from "./gui/statusBubble";
// export all types from both types files
export type * from "./networking/html/types";
export type * from "./gui/types";

if (typeof window !== "undefined") {
    Object.assign(window, {
        NSScript,
        addTopBarButton,
        addSidebarButton,
        prettify,
        canonicalize
    });
}
