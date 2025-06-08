// by default get user input through waiting for the user to press space
export default async function waitForSpace() {
	return new Promise<void>((resolve) => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === " ") {
				document.removeEventListener("keydown", handleKeyDown);
				resolve();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
	});
}
