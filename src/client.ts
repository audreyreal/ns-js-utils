import { get, set } from "idb-keyval";
import { StatusBubble } from "./gui/statusBubble";
import { canonicalize, parseHtml, prettify } from "./helpers";
import storeAuth from "./networking/html/auth";
import type {
	ApplyToWorldAssemblyFormData,
	MoveRegionFormData,
} from "./networking/html/types";

/**
 * Represents a script for interacting with NationStates, providing methods for authentication,
 * nation management, storage, and web requests.
 *
 * @class
 * @description Manages NationStates-specific operations like logging in, moving regions,
 * applying to the World Assembly, and making authenticated HTML requests.
 */
export class NSScript {
	private scriptName: string;
	private scriptVersion: string;
	private scriptAuthor: string;
	public statusBubble: StatusBubble;
	public currentUser: string;

	private isHtmlRequestInProgress = false;

	/**
	 * Initializes a new NSScript instance with script metadata and current user information.
	 *
	 * @param name The name of the script
	 * @param version The version of the script
	 * @param author The author of the script
	 * @param user The current user of the script
	 */
	constructor(name: string, version: string, author: string, user: string) {
		this.scriptName = name;
		this.scriptVersion = version;
		this.scriptAuthor = author;
		this.currentUser = user;
		this.statusBubble = StatusBubble.getInstance();
	}

	/**
	 * Stores a key-value pair in the IndexedDB key-value store.
	 *
	 * @param key The key under which the value will be stored
	 * @param value The value to be stored, which can be of any type
	 * @returns A Promise that resolves when the value is successfully stored
	 */
	public async set(key: string, value: unknown): Promise<void> {
		await set(key, value);
	}

	/**
	 * Retrieves a value from the IndexedDB key-value store by its key.
	 *
	 * @param key The key of the value to retrieve
	 * @returns A Promise that resolves to the stored value, or undefined if the key is not found
	 */
	public async get(key: string): Promise<unknown> {
		return await get(key);
	}

	/**
	 * Makes a request to a page on the NationStates HTML site.
	 * @param pagePath The path to the page on NationStates (e.g., "index.html", "page=create_nation").
	 *                This path is relative to "https://www.nationstates.net/".
	 * @param payload An object containing key-value pairs to be sent as the request payload.
	 * @returns A Promise that resolves to the Fetch API's Response object.
	 */
	public async makeNsHtmlRequest(
		pagePath: string,
		payload?: Record<string, string | number | boolean>,
		followRedirects = true,
	): Promise<Response> {
		if (this.isHtmlRequestInProgress) {
			return Promise.reject(
				new Error(
					"Simultaneous request denied: Another request is already in progress.",
				),
			);
		}

		this.isHtmlRequestInProgress = true;

		// Disable all submit buttons to enforce simultaneity
		for (const btn of document.querySelectorAll<HTMLButtonElement>(
			'button[type="submit"]',
		)) {
			btn.disabled = true;
		}
		try {
			this.statusBubble.info(`Loading: ${pagePath}...`);
			const baseUrl = "https://www.nationstates.net/";

			// Construct the value for the 'script' parameter
			const scriptParamValue = `${this.scriptName} v${this.scriptVersion} by ${this.scriptAuthor} in use by ${this.currentUser}`;

			const requestParams = new URLSearchParams();

			// Add payload data to requestParams if provided
			if (payload) {
				for (const key in payload) {
					if (Object.prototype.hasOwnProperty.call(payload, key)) {
						requestParams.append(key, String(payload[key]));
					}
				}
			}

			// Add special parameters
			requestParams.append("userclick", Date.now().toString());
			requestParams.append("script", scriptParamValue);
			if (!pagePath.endsWith(".cgi")) {
				requestParams.append("template-overall", "none");
			}

			// inject auth values
			//
			// man past me was such a genius
			// for figuring out you can do this lmfao
			const lastKnownChk = localStorage.getItem("lastKnownChk");
			if (lastKnownChk) {
				requestParams.append("chk", lastKnownChk);
			}
			const lastKnownLocalid = localStorage.getItem("lastKnownLocalid");
			if (lastKnownLocalid) {
				requestParams.append("localid", lastKnownLocalid);
			}

			// Ensure the baseUrl has a trailing slash for correct URL resolution
			const safeBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
			const finalUrl = new URL(pagePath, safeBaseUrl).toString();

			const response = await fetch(finalUrl, {
				credentials: "include",
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: requestParams.toString(),
				redirect: followRedirects ? "follow" : "manual",
			});
			return response;
		} finally {
			this.isHtmlRequestInProgress = false;

			// Re-enable all submit buttons
			for (const btn of document.querySelectorAll<HTMLButtonElement>(
				'button[type="submit"]',
			)) {
				btn.disabled = false;
			}
		}
	}

	/**
	 * Fetches and processes an HTML page from the NationStates site.
	 * Handles security checks and captcha detection.
	 * @param pagePath The path to the page on NationStates.
	 * @param payload Optional payload to send with the request.
	 * @returns A Promise that resolves to the HTML content of the page as a string.
	 * @throws Error if the request fails, security check fails, or captcha is detected.
	 */
	public async getNsHtmlPage(
		pagePath: string,
		payload?: Record<string, string | number | boolean>,
	): Promise<string> {
		const response = await this.makeNsHtmlRequest(pagePath, payload);
		if (!response.ok) {
			throw new Error(`Failed to fetch page: ${response.statusText}`);
		}
		const text = await response.text();
		if (text.includes("Failed security check")) {
			throw new Error(
				"Failed security check. Please run reauth and try again.",
			);
		}
		if (text.includes("Border Patrol")) {
			throw new Error(
				"You need to solve the border patrol captcha before proceeding.",
			);
		}
		const doc = parseHtml(text);
		storeAuth(doc);
		return text;
	}

	/**
	 * Attempts to log in to a NationStates nation.
	 * @param nationName The name of the nation to log in to.
	 * @param password The password for the nation.
	 * @returns A Promise that resolves to true if login is successful, false otherwise.
	 */
	public async login(nationName: string, password: string): Promise<boolean> {
		const text = await this.getNsHtmlPage("page=display_region", {
			region: "rwby",
			nation: nationName,
			password: password,
			logging_in: "1",
			submit: "Login",
		});
		const canonNation = canonicalize(nationName);
		const re = /(?<=Move )(.*?)(?= to RWBY!)/; // This regex captures the nation name in the "Move [Nation] to RWBY!" button
		const match = text.match(re);
		if (match && canonicalize(match[0]) === canonNation) {
			// Check if the nation name in the button matches the input nation
			this.statusBubble.success(`Logged in to nation: ${prettify(nationName)}`);
			return true;
		}
		this.statusBubble.warn(
			`Failed to log in to nation: ${prettify(nationName)}`,
		);
		return false;
	}

	/**
	 * Re-authenticates the current session by fetching the region page
	 * for RWBY, getting the CHK and localid values from the response.
	 */
	public async reAuthenticate(): Promise<void> {
		await this.getNsHtmlPage("page=display_region", {
			region: "rwby",
		});
		this.statusBubble.success("Re-authenticated");
	}

	/**
	 * Attempts to create a new nation in the specified region.
	 * @param nationName The name of the nation to create.
	 * @param password Optional password for the nation.
	 * @returns A Promise that resolves to true if the creation is successful, false otherwise.
	 */
	public async restoreNation(
		nationName: string,
		password: string,
	): Promise<boolean> {
		const response = await this.makeNsHtmlRequest(
			"",
			{
				logging_in: "1",
				restore_password: password,
				restore_nation: "1",
				nation: nationName,
			},
			false,
		);
		if (response.status === 302) {
			this.statusBubble.success(
				`Successfully restored nation: ${prettify(nationName)}\nYou need to re-authenticate to perform actions on this nation.`,
			);
			return true;
		}
		this.statusBubble.warn(`Failed to restore nation: ${prettify(nationName)}`);
		return false;
	}

	/**
	 * Attempts to move the current nation to a different region.
	 * @param regionName The name of the region to move to.
	 * @param password Optional password for the region.
	 * @returns A Promise that resolves to true if the move is successful, false otherwise.
	 */
	public async moveToRegion(
		regionName: string,
		password?: string,
	): Promise<boolean> {
		const payload: MoveRegionFormData = {
			region_name: regionName,
			move_region: "1",
		};
		if (password) {
			payload.password = password;
		}
		const text = await this.getNsHtmlPage("page=change_region", payload);
		if (text.includes("Success!")) {
			this.statusBubble.success(`Moved to region: ${prettify(regionName)}`);
			return true;
		}
		this.statusBubble.warn(`Failed to move to region: ${prettify(regionName)}`);
		return false;
	}

	/**
	 * Attempts to apply to or reapply to the World Assembly.
	 * @param reapply Whether to reapply to the World Assembly if you've already recently applied
	 * @returns A Promise that resolves to true if the application is successful, false otherwise.
	 */
	public async applyToWorldAssembly(reapply?: boolean): Promise<boolean> {
		let payload: ApplyToWorldAssemblyFormData;
		if (reapply) {
			payload = {
				action: "join_UN",
				resend: "1",
			};
		} else {
			payload = {
				action: "join_UN",
				submit: "1",
			};
		}

		const text = await this.getNsHtmlPage("page=UN_Status", payload);
		if (
			text.includes(
				"Your application to join the World Assembly has been received!",
			)
		) {
			this.statusBubble.success("Applied to World Assembly");
			return true;
		}
		this.statusBubble.warn("Failed to apply to World Assembly");
		return false;
	}

	/**
	 * Attempts to join the World Assembly as a member.
	 * @param nationName The name of the nation to join as.
	 * @param appId The application ID for the nation.
	 * @returns A Promise that resolves to true if the join is successful, false otherwise.
	 */
	public async joinWorldAssembly(
		nationName: string,
		appId: string,
	): Promise<boolean> {
		const text = await this.getNsHtmlPage("cgi-bin/", {
			nation: nationName,
			appid: appId.trim(),
		});
		if (text.includes("Welcome to the World Assembly, new member ")) {
			this.statusBubble.success(
				`Joined World Assembly as ${prettify(nationName)}`,
			);
			return true;
		}
		this.statusBubble.warn("Failed to join World Assembly");
		return false;
	}

	/**
	 * Attempts to resign from the World Assembly.
	 * @returns A Promise that resolves to true if the resignation is successful, false otherwise.
	 */
	public async resignWorldAssembly(): Promise<boolean> {
		const text = await this.getNsHtmlPage("page=UN_Status", {
			action: "leave_UN",
			submit: "1",
		});
		if (text.includes("From this moment forward, your nation is on its own.")) {
			this.statusBubble.success("Resigned from World Assembly");
			return true;
		}
		this.statusBubble.warn("Failed to resign from World Assembly");
		return false;
	}
}
