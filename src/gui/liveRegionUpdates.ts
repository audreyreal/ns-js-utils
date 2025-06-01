type EventData = {
    str: string;
    time: number;
    htmlStr: string;
}

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
                // Parse the HTML content
                const parsedUpdate = parseHtml(data.htmlStr);
                // Find the time element in the parsed update
                const updateTimeElement = parsedUpdate.querySelector('time');
                
                if (updateTimeElement) {
                    const datetime = updateTimeElement.getAttribute('datetime');
                    const epoch = updateTimeElement.getAttribute('epoch');
                    const timeText = updateTimeElement.textContent;
                    
                    // Update the DOM element
                    const lastUpdateElement = document.getElementsByTagName('time')[0];
                    if (lastUpdateElement && datetime && epoch && timeText) {
                        lastUpdateElement.setAttribute('datetime', datetime);
                        lastUpdateElement.setAttribute('epoch', epoch);
                        lastUpdateElement.textContent = timeText;
                    }
                }
            }
        };
    }
}
