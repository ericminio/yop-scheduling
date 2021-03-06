const payload = require('../../support/payload');
const { CreateEvent, EventFactoryValidatingNeighboursWithDependencies } = require('../../../domain');

class CreateEventRoute {
    constructor(adapters) {
        this.createEvent = new CreateEvent(new EventFactoryValidatingNeighboursWithDependencies(adapters));
    }
    
    matches(request) {
        return request.method=='POST' && request.url == '/data/events/create';
    }
    async go(request, response, server) {
        let incoming = await payload(request);
        this.createEvent.use(server.adapters);
        this.createEvent.please(incoming)
            .then((event)=>{
                response.statusCode = 201;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ location:'/data/events/' + event.id }));                
            })
            .catch((error)=> {
                response.statusCode = 400;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ message:error.message }));
            })
            .finally(()=>{ response.end(); });
    }
}

module.exports = CreateEventRoute;