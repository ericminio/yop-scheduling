const { expect } = require('chai');
const { DeleteOneEvent } = require('..');
const { Server } = require('../../yop/server');
const { request } = require('../../support/request');
const port = 8007;
const deletion = {
    hostname: 'localhost',
    port: port,
    path: '/data/events/42',
    method: 'DELETE'
};

describe('DeleteEventRoute', ()=> {
    let route;
    let server;
    let shared;
    beforeEach((done)=>{
        route = new DeleteOneEvent();
        server = new Server(port);
        server.routes = [route];
        route.deleteEvent = {
            use: (adapters)=> { shared = adapters; },
            please: (id)=> new Promise((resolve, reject)=> { resolve(); } )
        };
        server.adapters = 'shared';
        server.start(done);
    });
    afterEach((done)=> {
        server.stop(done);
    });

    it('shares adapters', async ()=>{
        await request(deletion);

        expect(shared).to.equal('shared');
    });

    it('provides event deletion', async ()=>{
        let response = await request(deletion);
        
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.equal(JSON.stringify({ message:'Event deleted' }));
        expect(response.headers['content-type']).to.equal('application/json');
    });
    
    it('propagates errors', async ()=>{
        route.deleteEvent.please = (id)=> new Promise((resolve, reject)=> { reject({ message:'deletion failed' }); } )
        let response = await request(deletion);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'deletion failed' });
        expect(response.statusCode).to.equal(400);
    });
})