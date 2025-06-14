import { NSScript } from "./client";
import { addSidebarButton } from "./gui/sideBarButton";
import { addTopBarButton } from "./gui/topBarButton";
import { prettify, canonicalize } from "./helpers";
// imported everything for assigning to window
// now exporting for docs
export { NSScript } from "./client";
export { addTopBarButton } from "./gui/topBarButton";
export { addSidebarButton } from "./gui/sideBarButton";
export { prettify, canonicalize } from "./helpers";
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
		canonicalize,
	});
}
