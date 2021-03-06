const showResourceTemplate = document.createElement('template')
showResourceTemplate.innerHTML = `

<style>
    #show-resource-form {
        position: absolute;
        width: var(--resourceAreaWidth);
        top: var(--timelineHeigth);
        margin-top: 0px;
    }
    #delete-resource {
        background-color: var(--background-delete);
        color: var(--color-delete);
    }
</style>

<div class="vertical-form hidden" id="show-resource-form">
    <label>Type</label>
    <input id="resource-info-type" />
    <label>Name</label>
    <input id="resource-info-name" />

    <button id="delete-resource">Delete</button>
<div>
`;

class ShowResource extends HTMLElement {

    constructor() {
        super();
        this.deleteResource = new DeleteResource();
        this.deleteResource.use({ deleteResource: new DeleteResourceUsingHttp(api) });
    }
    connectedCallback() {
        this.appendChild(showResourceTemplate.content.cloneNode(true));
        this.querySelector('#delete-resource').addEventListener('click', ()=> { this.goDeleteResource(); });
        this.eventId = eventBus.register(this, 'show resource');
    }
    disconnectedCallback() {
        eventBus.unregister(this.eventId);
    }
    update(resource) {
        this.resource = resource;
        this.querySelector('#show-resource-form').classList.toggle('hidden');
        this.querySelector('#resource-info-type').value = resource.type;
        this.querySelector('#resource-info-name').value = resource.name;
    }
    goDeleteResource() {
        this.deleteResource.please(this.resource)
            .then(()=> {
                eventBus.notify('resource deleted');
                this.querySelector('#show-resource-form').classList.add('hidden');
            });
    }
};
customElements.define('show-resource', ShowResource);

