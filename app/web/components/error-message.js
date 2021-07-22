const errorMessageTemplate = document.createElement('template')
errorMessageTemplate.innerHTML = `
<style>
    #error-message {
        position: absolute;
        top: 0px;
        right: 0px;
        margin: 5px;
        padding: 10px;
        background-color: red;
        color: white;
        cursor: pointer;
    }
</style>
<div id="error-message" class="hidden">
</div>
`;

class ErrorMessage extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(errorMessageTemplate.content.cloneNode(true));
        this.querySelector('#error-message').addEventListener('click', ()=> { this.acknowledge(); } );
        events.register(this, 'error');
    }
    update(error) {
        this.querySelector('#error-message').classList.remove('hidden');
        this.querySelector('#error-message').innerHTML = error.message;
    }
    acknowledge() {
        this.querySelector('#error-message').classList.add('hidden');
    }
};
customElements.define('yop-error-message', ErrorMessage);
