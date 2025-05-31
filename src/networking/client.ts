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
            if (!pagePath.endsWith('.cgi')) {
                requestParams.append("template-overall", "none");
            }

            // inject auth values
            const lastKnownChk = localStorage.getItem('lastKnownChk');
            if (lastKnownChk) {
                requestParams.append("chk", lastKnownChk);
            }
            const lastKnownLocalid = localStorage.getItem('lastKnownLocalid');
            if (lastKnownLocalid) {
                requestParams.append("localid", lastKnownLocalid);
            }

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

    public async getNsHtmlPage(
        pagePath: string,
        payload?: Record<string, string | number | boolean>
    ): Promise<String> {
        const response = await this.makeNsHtmlRequest(pagePath, payload);
        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.statusText}`);
        }
        const text = await response.text();
        if (text.includes("Failed security check")) {
            throw new Error("Failed security check. Please try again later.");
        }
        if (text.includes("Border Patrol")) {
            throw new Error("You need to solve the border patrol captcha before proceeding.");
        }
        const doc = parseHtml(text);
        storeAuth(doc);
        return text;
    }

    public async login(
        nation: string,
        password: string,
    ): Promise<boolean> {
        const text = await this.getNsHtmlPage("page=display_region", {
            "region": "rwby",
            "nation": nation,
            "password": password,
            "logging_in": "1",
            "submit": "Login",
        });
        const canonNation = canonicalize(nation);
        const re = /(?<=Move )(.*?)(?= to RWBY!)/; // This regex captures the nation name in the "Move [Nation] to RWBY!" button
        const match = text.match(re);
        if (match && canonicalize(match[0]) === canonNation) { // Check if the nation name in the button matches the input nation
            return true
        }
        console.error("Failed to login to nation:", nation);
        return false;
    }

    public async reAuthenticate(): Promise<void> {
        await this.getNsHtmlPage("page=display_region", {
            "region": "rwby",
        });
    }

    public async moveToRegion(region: string, password?: string): Promise<boolean> {
        let payload: MoveRegionFormData = {
            "region_name": region,
            "move_region": "1"
        }
        if (password) {
            payload.password = password;
        }
        const text = await this.getNsHtmlPage("page=change_region", payload);
        if (text.includes("Success!")) {
            return true;
        }
        console.error("Failed to move to region:", region);
        return false;
    }

    public async applyToWorldAssembly(reapply?: boolean): Promise<boolean> {
        let payload: ApplyToWorldAssemblyFormData;
        if (reapply) {
            payload = {
                action: "join_UN",
                resend: "1"
            };
        } else {
            payload = {
                action: "join_UN",
                submit: "1"
            };
        }

        const text = await this.getNsHtmlPage("page=UN_Status", payload);
        if (text.includes("Your application to join the World Assembly has been received!")) {
            return true;
        }
        console.error("Failed to apply to World Assembly");
        return false;
    }
}