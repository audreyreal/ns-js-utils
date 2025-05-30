class NSScript {
    private scriptName: string;
    private scriptVersion: string;
    private scriptAuthor: string;
    public currentUser: string;

    private isHtmlRequestInProgress: boolean = false;

    constructor(name: string, version: string, author: string, user: string) {
        this.scriptName = name;
        this.scriptVersion = version;
        this.scriptAuthor = author;
        this.currentUser = user;
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
        payload?: Record<string, string | number | boolean>
    ): Promise<Response> {
        if (this.isHtmlRequestInProgress) {
            return Promise.reject(new Error("Simultaneous request denied: Another request is already in progress."));
        }

        this.isHtmlRequestInProgress = true;

        // Disable all submit buttons to enforce simultaneity
        document.querySelectorAll('button[type="submit"]').forEach(btn => {
            (btn as HTMLButtonElement).disabled = true;
        });
        try {
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

            // Ensure the baseUrl has a trailing slash for correct URL resolution
            const safeBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
            const finalUrl = new URL(pagePath, safeBaseUrl).toString();

            const response = await fetch(finalUrl, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: requestParams.toString(),
            });
            return response;
        } finally {
            this.isHtmlRequestInProgress = false;

            // Re-enable all submit buttons
            document.querySelectorAll('button[type="submit"]').forEach(btn => {
                (btn as HTMLButtonElement).disabled = false;
            });
        }
    }
}