const calendarTemplate = document.createElement('template')
calendarTemplate.innerHTML = `

<style>
    .calendar-table {
        width: 100%;    
        border-spacing: 0px;    
    }
    .calendar-table td {
        padding: 0px;
        vertical-align: top;
    }
    .column-one {
        width: var(--resourceAreaWidth);
    }
    .column-two, .column-three {
        width: calc(var(--agendaAreaWidth) / 2);
    }
    .column-two-three-together {
        width: var(--agendaAreaWidth);
    }

    .calendar-table .vertical-form {
        margin-top: 0px;
    }
</style>

<div style="position: relative;">
    <table class="calendar-table">
        <tbody>
            <tr>
                <td class="column-one"></td>
                <td class="column-two-three-together" colspan="2">
                    <yop-day-selection></yop-day-selection>
                    <yop-timeline></yop-timeline>
                </td>
            </tr>
            <tr>
                <td class="column-one">
                    <resources></resources>
                </td>
                <td class="column-two-three-together" colspan="2">
                    <events></events>                    
                    <show-resource></show-resource>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <resource-creation-trigger></resource-creation-trigger>
                </td>
            </tr>
            <tr>
                <td class="column-one">
                    <resource-creation-form></resource-creation-form>
                </td>
                <td class="column-two">
                    <event-creation></event-creation>
                </td>
                <td class="column-three">
                    <show-event></show-event>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`;

class CalendarDay extends HTMLElement {

    constructor() {
        super();
        this.searchEvents = new SearchEvents();
        this.searchEvents.use({ searchEvents:new EventsSearchUsingHttp(api) });
    }
    async connectedCallback() {
        this.appendChild(calendarTemplate.content.cloneNode(true))
        this.querySelector('events').addEventListener('click', (e)=>{
            events.notify('event creation', this.querySelector("#calendar-date").value);
        });
        events.register(this, 'calendar update');
        events.register(this, 'resource created');
        events.register(this, 'event created');
        events.register(this, 'event deleted');
        events.register(this, 'resource deleted');
        this.update();
    }
    update() {
        let date = this.querySelector("#calendar-date").value;
        this.updateResourcesAndEvents(date);
    }
    updateResourcesAndEvents(date) {
        let resourcesLoaded = data.getResources();
        resourcesLoaded
            .then(data => {
                this.resources = data.resources;
                this.resourceMap = {};
                this.resources.forEach((resource) => {
                    this.resourceMap[resource.getId()] = resource; 
                });
                store.saveObject('resources', data.resources);
            })
            .catch(()=> { 
                store.delete('resources'); 
                events.notify('maybe signed-out')
            });
            
        let start = `${date} 00:00:00`;
        let end = `${formatDate(nextDay(date))} 00:00:00`;
        let eventsLoaded = this.searchEvents.inRange(start, end);
        eventsLoaded.then(data => this.events = data.events);

        Promise.all([resourcesLoaded, eventsLoaded])
            .then(()=> { 
                this.clear();
                this.displayResources();
                this.displayEvents(); 
            })
    }
    clear() {
        let size = this.resources.length;
        let events = this.querySelector('events');
        events.innerHTML = '';
        events.style.height = layout.totalHeight(size);
        let resources = this.querySelector('resources');
        resources.innerHTML = '';
        resources.style.height = layout.totalHeight(size);
    }
    displayResources() {
        let view = this.querySelector('resources');
        this.resources.forEach((resource, index) => {
            let instance = new ResourceRenderer();
            instance.digest(resource, index);
            view.appendChild(instance);
        });
    }
    displayEvents() {
        let view = this.querySelector('events');
        this.events.forEach(event => {
            event.resources.forEach((eventResource)=> {
                let resource = this.resourceMap[eventResource.id];
                let instance = new CalendarEvent();
                instance.digest(event, resource);
                view.appendChild(instance);
            });
        });
    }
};
customElements.define('yop-calendar-day', CalendarDay);

