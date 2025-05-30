/**
 * Stores the nation name from the body's data-nname attribute in localStorage.
 */
function storeNation(): void {
    const bodyElement = document.body as HTMLBodyElement | null;
    const nationName = bodyElement?.getAttribute('data-nname');

    if (nationName) {
        try {
            localStorage.setItem('lastKnownNation', nationName);
        } catch (error) {
            console.error('Error storing lastKnownNation to localStorage:', error);
        }
    }
}

/**
 * Stores the chk value from the hidden input with name="chk" in localStorage.
 */
function storeChk(): void {
    const chkInput = document.querySelector('input[name="chk"]') as HTMLInputElement | null;
    const chkValue = chkInput?.value;

    if (chkValue) {
        try {
            localStorage.setItem('lastKnownChk', chkValue);
        } catch (error) {
            console.error('Error storing lastKnownChk to localStorage:', error);
        }
    }
}

/**
 * Stores the localid value from the hidden input with name="localid" in localStorage.
 */
function storeLocalid(): void {
    const localidInput = document.querySelector('input[name="localid"]') as HTMLInputElement | null;
    const localidValue = localidInput?.value;

    if (localidValue) {
        try {
            localStorage.setItem('lastKnownLocalid', localidValue);
        } catch (error) {
            console.error('Error storing lastKnownLocalid to localStorage:', error);
        }
    }
}

/**
 * Retrieves nation, chk, and localid from the DOM and stores them in localStorage.
 */
function storeAuth(): void {
    storeNation();
    storeChk();
    storeLocalid();
}

window.addEventListener('load', () => {
    storeAuth();
});