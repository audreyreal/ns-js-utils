class StatusBubble extends HTMLDivElement {
    public constructor() {
        super();
        this.textContent = 'Awaiting orders';
        this.style.color = 'black';
        this.style.width = '200px';
        this.style.height = '100px';
        this.style.border = 'solid 1px black';
        this.style.left = '20px';
        this.style.bottom = '20px';
        this.style.position = 'fixed';
        this.style.fontSize = '12px';
        this.style.textAlign = 'center';
        this.style.verticalAlign = 'middle';
        this.style.lineHeight = '25px';
        this.style.overflowWrap = 'anywhere';
        this.style.padding = '10px';
        this.style.zIndex = '2';
        this.style.backgroundColor = '#9696FF';
    }

    public show(message: string): void {
        this.textContent = message;
        this.style.display = 'block';
    }

    public hide(): void {
        this.style.display = 'none';
    }

    public setColor(color: string): void {
        switch (color) {
            case 'blue':
                this.style.backgroundColor = '#9696FF';
                break;
            case 'yellow':
                this.style.backgroundColor = '#FFFF64';
                break;
            case 'red':
                this.style.backgroundColor = '#FF6464';
                break;
            default:
                this.style.backgroundColor = color;
                break;
        }
    }

    public success(message: string): void {
        this.setColor('blue');
        this.show(message);
    }

    public info(message: string): void {
        this.setColor('yellow');
        this.show(message);
    }

    public warn(message: string): void {
        this.setColor('red');
        this.show(message);
    }
}

// check if running in a browser environment
if (typeof window !== 'undefined') {
    customElements.define('status-bubble', StatusBubble, { extends: 'div' });
}
// in order to use this in a browser, you would need to create an instance of StatusBubble and append it to the document body
// Example usage:
// const statusBubble = new StatusBubble();
// document.body.appendChild(statusBubble);