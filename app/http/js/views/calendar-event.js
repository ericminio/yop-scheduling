class CalendarEvent extends HTMLElement {
    constructor() {
        super()
    }
    digest(event) {
        this.id = `event-${event.id}`;
        this.dataset.width = this.width(event);
        this.dataset.left = this.left(event);
        this.dataset.top = this.top(event);
        this.style = `
            top:${this.dataset.top}; 
            left:${this.dataset.left}; 
            width:${this.dataset.width};
        `;
    }
    width(event) {
        let startHour = this.parse(event.start).hours;
        let endHour = this.parse(event.end).hours;
        return `calc((${endHour - startHour} * 60 / var(--minimalWidthInMinutes)) * var(--minimalWidth))`;
    }
    left(event) {
        let { hours } = this.parse(event.start);
        return `calc((${hours} * 60 / var(--minimalWidthInMinutes)) * var(--minimalWidth) + var(--padding))`;
    }
    top(event) {
        return `calc(${event.line} * var(--height) + var(--padding))`;
    }
    parse(time) {
        let parts = time.split(':');
        return {
            hours: parts[0],
            minutes: parts[1]
        }
    }
};
customElements.define('yop-calendar-event', CalendarEvent);
