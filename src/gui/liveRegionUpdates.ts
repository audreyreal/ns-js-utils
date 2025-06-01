type EventData = {
    str: string;
    time: number;
    htmlStr: string;
}

// this function was stolen from reliant :3 thank you paul haku
function timeAgo(unixTimestamp: number): string {
    const now = Date.now();
    const providedTime = unixTimestamp * 1000; // Convert to milliseconds
    const difference = Math.floor((now - providedTime) / 1000); // Difference in seconds

    if (difference <= 59) {
        return 'Seconds ago';
    } else if (difference < 3600) {
        const minutes = Math.floor(difference / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
        const hours = Math.floor(difference / 3600);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
}

// this needs refactoring someday, this is a mess

// check if running in browser
if (typeof window !== 'undefined') {
    // check if there's a div with id 'regioncontent
    let regioncontent = document.getElementById('regioncontent');
    if (regioncontent) {
        // get the region name through the first h1 element's text content
        const regionName = regioncontent.querySelector('h1')?.textContent?.trim();
        // start an SSE listener
        const eventSource = new EventSource(`https://www.nationstates.net/api/region:${canonicalize(regionName)}`);
        eventSource.onmessage = function(event) {
            // parse the JSON data
            let data: EventData = JSON.parse(event.data);
            // check if the world assembly delegate changed
            if (data.str.includes('became WA Delegate of ')){
                // use domparser to parse the html string
                const parsed_event = parseHtml(data.htmlStr);
                // get the a element with class nlink
                const newDelegateElement = parsed_event.querySelector('a.nlink');
                // get the old delegate element through a p tag containing the text "WA Delegate:"
                const oldDelegateElementContainer = parsed_event.querySelector('p:contains("WA Delegate:")');
                // get the a tag inside the p tag
                const oldDelegateElement = oldDelegateElementContainer?.querySelector('a');
                // replace the a tag of the old delegate with the new delegate
                if (newDelegateElement && oldDelegateElement) {
                    oldDelegateElement.replaceWith(newDelegateElement);
                }
                // replace the elected time with the new delegate's elected time
                const electedTimeElement = parsed_event.querySelector('time');
                // replace the time element in the DOM with the new one
                if (electedTimeElement) {
                    oldDelegateElementContainer?.replaceChild(electedTimeElement, oldDelegateElementContainer.querySelector('time') || document.createElement('time'));
                }
            }   
            // check if the region updated
            if (data.str.includes(' updated.')) {
                // get the datetime parameter from the html string using a regex
                const datetime = data.htmlStr.match(/datetime="([^"]+)"/);
                // get the epoch time from the html string using a regex
                const epoch = data.htmlStr.match(/epoch="([^"]+)"/);
                // modify the DOM with the new last wa update time
                if (datetime && epoch) {
                    const lastUpdateElement = document.getElementsByTagName('time')[0];
                    if (lastUpdateElement) {
                        lastUpdateElement.setAttribute('datetime', datetime[1]);
                        lastUpdateElement.setAttribute('epoch', epoch[1]);
                        lastUpdateElement.textContent = timeAgo(parseInt(epoch[1]));
                    }
                }
            }
        };
    }
}