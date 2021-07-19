const Resource = require('../domain/resource');

class EventsResourcesRepository {
    constructor(database) {
        this.database = database;
    }
    async getResourcesByEvent(id) {
        let rows = await this.database.executeSync(`
            select id, type, name 
            from resources, events_resources 
            where events_resources.resource_id = resources.id 
                and event_id=$1
            order by name
            `, [id]);
        let collection = [];
        for (let i=0; i<rows.length; i++) {
            let record = rows[i];
            collection.push(new Resource({
                id:record.id,
                type:record.type,
                name:record.name
            }));
        }
        return collection;
    }
    async deleteByEvent(id) {
        await this.database.executeSync('delete from events_resources where event_id=$1', [id]);
    }
    async add(eventId, resourceId) {
        await this.database.executeSync('insert into events_resources(event_id, resource_id) values($1, $2)', [eventId, resourceId]);
    }
    async deleteByResource(id) {
        await this.database.executeSync('delete from events_resources where resource_id=$1', [id]);
    }
}

module.exports = EventsResourcesRepository;