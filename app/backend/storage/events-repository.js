const ResourcesRepository = require('./resources-repository');
const EventsResourcesRepository = require('./events-resources-repository');
const { Event } = require('../../domain');

class EventsRepository {
    constructor(database) {
        this.database = database;
        this.resourcesRepository = new ResourcesRepository(database);
        this.eventsResourcesRepository = new EventsResourcesRepository(database);
    }
    async save(event) {
        if (! await this.exists(event.id)) {
            await this.database.executeSync('insert into events(id, label, notes, start_time, end_time) values($1, $2, $3, $4, $5)', 
                [event.getId(), event.getLabel(), event.getNotes(), event.getStart(), event.getEnd()]);
        }
        else {
            await this.database.executeSync(`update events set label=$2, notes=$3, start_time=$4, end_time=$5 where id=$1`, 
                [event.getId(), event.getLabel(), event.getNotes(), event.getStart(), event.getEnd()]);
        }
        await this.eventsResourcesRepository.deleteByEvent(event.getId());
        let resources = event.getResources();
        for (let i=0; i<resources.length; i++) {
            let resource = resources[i];
            await this.eventsResourcesRepository.add(event.getId(), resource.id);
        }
    }
    async get(id) {
        let rows = await this.database.executeSync('select label, notes, start_time, end_time from events where id=$1 order by label', [id]);
        if (rows.length == 0) { return undefined; }
        let record = rows[0];
        let event = new Event({
            id:id,
            label:record.label,
            notes:record.notes,
            start:record.start_time,
            end:record.end_time
        });
        event.setResources(await this.eventsResourcesRepository.getResourcesByEvent(id))
        return event;
    }
    async search(start, end) {
        let start_datetime = `${start} 00:00:00`;
        let end_datetime = `${end} 00:00:00`;
        let rows = await this.database.executeSync(`
            select event_id, label, notes, start_time, end_time, resource_id 
            from events_resources, events
            where events_resources.event_id = events.id 
            and end_time >= '${start_datetime}'
            and start_time < '${end_datetime}'
            order by event_id
            `);

        return this.collectionFrom(rows);
    }
    async all() {
        let rows = await this.database.executeSync(`
            select event_id, label, notes, start_time, end_time, resource_id 
            from events_resources, events
            where events_resources.event_id = events.id 
            order by event_id
            `);
        return this.collectionFrom(rows);
    }
    async delete(id) {
        await this.eventsResourcesRepository.deleteByEvent(id);
        await this.database.executeSync('delete from events where id=$1', [id]);
    }
    async truncate() {
        await this.database.executeSync('truncate table events');
    }
    
    async exists(id) {
        let rows = await this.database.executeSync('select id from events where id=$1', [id]);
        return rows.length > 0;
    }
    collectionFrom(rows) {
        let collection = [];
        let currentId = -1;
        let currentEvent;
        for (let i=0; i<rows.length; i++) {
            let record = rows[i];
            if (record.event_id != currentId) {
                currentId = record.event_id;
                currentEvent = new Event({
                    id:record.event_id,
                    label:record.label,
                    notes:record.notes,
                    start:record.start_time,
                    end:record.end_time
                });
                currentEvent.resources = [];
                collection.push(currentEvent);
            }
            currentEvent.resources.push({ id:record.resource_id });
        }
        return collection;
    }
}

module.exports = EventsRepository;