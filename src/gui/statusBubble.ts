/**
 * A singleton status bubble UI component for displaying messages with different color states.
 *
 * @remarks
 * This class creates a fixed-position div element that can be used to show status messages
 * with different color indicators (blue, yellow, red) or custom colors.
 *
 * @example
 * const statusBubble = StatusBubble.getInstance();
 * statusBubble.success("Operation completed successfully");
 * statusBubble.warn("Warning: Something might be wrong");
 */
export class StatusBubble {
	private static instance: StatusBubble | null = null;
	private element: HTMLDivElement;

	private constructor() {
		this.element = document.createElement("div");
		this.element.textContent = "Awaiting orders";
		this.element.style.color = "black";
		this.element.style.width = "200px";
		this.element.style.height = "100px";
		this.element.style.border = "solid 1px black";
		this.element.style.left = "20px";
		this.element.style.bottom = "20px";
		this.element.style.position = "fixed";
		this.element.style.fontSize = "12px";
		this.element.style.textAlign = "center";
		this.element.style.verticalAlign = "middle";
		this.element.style.lineHeight = "25px"; // For vertical centering text
		this.element.style.overflowWrap = "anywhere";
		this.element.style.padding = "10px";
		this.element.style.zIndex = "20000"; // Ensure it's above all other elements
		this.element.style.backgroundColor = "#9696FF"; // Default color
		this.element.style.display = "block"; // Initially visible with default message
	}

	public static getInstance(): StatusBubble {
		if (!StatusBubble.instance) {
			StatusBubble.instance = new StatusBubble();
			if (typeof document !== "undefined" && document.body) {
				document.body.appendChild(StatusBubble.instance.element);
			}
		}
		return StatusBubble.instance;
	}

	public show(message?: string): void {
		if (message) {
			this.element.textContent = message;
		}
		this.element.style.display = "block";
	}

	public hide(): void {
		this.element.style.display = "none";
	}

	public setColor(color: string): void {
		switch (color) {
			case "blue":
				this.element.style.backgroundColor = "#9696FF";
				break;
			case "yellow":
				this.element.style.backgroundColor = "#FFFF64";
				break;
			case "red":
				this.element.style.backgroundColor = "#FF6464";
				break;
			default:
				this.element.style.backgroundColor = color;
				break;
		}
	}

	public success(message: string): void {
		this.setColor("blue");
		this.show(message);
	}

	public info(message: string): void {
		this.setColor("yellow");
		this.show(message);
	}

	public warn(message: string): void {
		this.setColor("red");
		this.show(message);
	}
}

// in order to use this in a browser, you would need to create an instance of StatusBubble and append it to the document body
// Example usage:
// const statusBubble = StatusBubble.getInstance();
// statusBubble.show("Hello from singleton!");
