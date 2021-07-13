class Route extends HTMLElement {

    connectedCallback() {
        if (this.getAttribute("then") !== null) {
            let then = this.getAttribute("then");
            this.then = `<${then}></${then}>`;
        }
        else {
            this.then = this.innerHTML;
        }
        events.register(this, 'navigation')
        this.update()
    }
    update() {
        console.log('location', window.location.pathname)
        if (window.location.pathname == this.getAttribute('when')) {
            this.innerHTML = this.then;
        }
        else {
            this.innerHTML = ''
        }
    }
}
customElements.define('yop-route', Route);
