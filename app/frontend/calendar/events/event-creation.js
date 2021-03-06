const eventCreationTemplate = document.createElement('template')
eventCreationTemplate.innerHTML = `

<style>
    #event-creation-form {
    }
    #new-event-resources input, #new-event-resources label {
        display: unset;
        width: unset;
    }
</style>

<div class="vertical-form hidden" id="event-creation-form">
    <label>Label</label>
    <input id="new-event-label" />
    <label>Notes</label>
    <textarea id="new-event-notes"></textarea>
    <label>Start</label>
    <input id="new-event-start" />
    <label>End</label>
    <input id="new-event-end" />
    <div id="new-event-resources"></div>

    <button id="create-event">Create</button>
<div>
`;

class EventCreation extends HTMLElement {

    constructor() {
        super();
        this.createEvent = new CreateEvent(new EventFactoryValidatingFields());
        this.createEvent.use ({ storeEvent:new EventCreateUsingHttp(api) });

    }
    connectedCallback() {
        this.appendChild(eventCreationTemplate.content.cloneNode(true));
        this.querySelector('#create-event').addEventListener('click', ()=> { this.goCreateEvent(); });
        this.eventId = eventBus.register(this, 'event creation');
    }
    disconnectedCallback() {
        eventBus.unregister(this.eventId);
    }
    update(date) {
        let resources = store.getObject('resources');
        let html = '';
        for (let i=0 ; i<resources.length; i++) {
            let resource = resources[i];
            let fragment = `
            <div style="display:inline-block;">
                <input  type="checkbox"
                        id="new-event-resource-${resource.id}" 
                        value="${resource.id}"
                        >
                <label for="new-event-resource-${resource.id}">${resource.name}</label>
            </div>`;
            html += fragment;
        }
        this.querySelector('#new-event-resources').innerHTML = html;        
        this.querySelector('#event-creation-form').classList.toggle('hidden');
        if (this.querySelector('#event-creation-form').classList.toString().indexOf('hidden') == -1) {
            this.querySelector('#new-event-label').focus();
            this.querySelector('#new-event-start').value = `${date} 08:00`;
            this.querySelector('#new-event-end').value = `${date} 20:00`;
        }
    }
    goCreateEvent() {
        this.createEvent.please(this.payload())
            .then(()=> { 
                eventBus.notify('success', { message:'Event created' }); 
                eventBus.notify('event created'); 
            })
            .catch(error => { eventBus.notify('error', { message:error.message }); })
            
    }
    payload() {
        let candidates = this.querySelectorAll('#new-event-resources input');
        let selected = [];
        for (let i=0; i<candidates.length; i++) {
            let candidate = candidates[i];
            if (candidate.checked) {
                selected.push({ id:candidate.value });
            }
        }
        return {
            label: this.querySelector('#new-event-label').value,
            notes: this.querySelector('#new-event-notes').value,
            start: this.querySelector('#new-event-start').value,
            end: this.querySelector('#new-event-end').value,
            resources: selected
        };
    }
};
customElements.define('event-creation', EventCreation);

