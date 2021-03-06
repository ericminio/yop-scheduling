const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('Header', ()=>{

    let wait = 10;
    describe('When configuration is already available', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        ${domain}
                        ${data}
                        store.saveObject('configuration', 
                            { title:'Resto', 'opening-hours':'12-15' });
                        ${components}
                    </script>
                </body>
            </html>
            `;
        let window;
        let document;

        beforeEach(()=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;        
        })

        it('uses the available title', (done)=>{
            setTimeout(()=> {
                expect(document.querySelector('yop-header #title').innerHTML).to.equal('Resto');
                done();
            }, wait);            
        });

        it('uses opening hours', (done)=>{
            setTimeout(()=> {
                let root = document.documentElement;
                let start = root.style.cssText;
                expect(start).to.equal('--opening-hours-start: 12; --opening-hours-end: 15;');
                done();
            }, wait); 
        });
    });

    it('cleans eventBus on disconnection', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        ${domain}
                        ${data}
                        store.saveObject('configuration', 
                            { title:'Resto', 'opening-hours':'12-15' });
                        ${components}
                    </script>
                </body>
            </html>
            `;
        let window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        let document = window.document;
        document.querySelector('yop-header').remove();

        expect(window.eventBus.isEmpty()).to.equal(true);
    });

    describe('When configuration is not already available', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        ${domain}
                        ${data}
                        api.configuration = ()=> new Promise((resolve)=>{ 
                            resolve({ title: 'Agenda', 'opening-hours':'8-15' }); 
                        });
                        ${components}
                    </script>
                </body>
            </html>
            `;
        let window;
        let document;

        beforeEach(()=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;        
        });

        it('goes to api', (done)=>{
            setTimeout(()=> {
                expect(document.querySelector('yop-header #title').innerHTML).to.equal('Agenda');
                done();
            }, wait);
        });

        it('stores it', (done)=>{
            setTimeout(()=> {
                expect(window.store.getObject('configuration')).to.deep.equal(
                    { title:'Agenda', 'opening-hours':'8-15', openingHoursStart:8, openingHoursEnd:15 } );
                done();
            }, wait);
        });
    });

    describe('When configuration is not completely available', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        ${domain}
                        ${data}
                        store.saveObject('configuration', { title:'Resto' });                    
                        api.configuration = ()=> new Promise((resolve)=>{ 
                            resolve({ title: 'Agenda', 'opening-hours':'8-15' }); 
                        });
                        ${components}
                    </script>
                </body>
            </html>
            `;
        let window;
        let document;

        beforeEach(()=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;        
        });

        it('goes to api', (done)=>{
            setTimeout(()=> {
                expect(document.querySelector('yop-header #title').innerHTML).to.equal('Agenda');
                done();
            }, wait);
        });

        it('stores it', (done)=>{
            setTimeout(()=> {
                expect(window.store.getObject('configuration')).to.deep.equal(
                    { title:'Agenda', 'opening-hours':'8-15', openingHoursStart:8, openingHoursEnd:15 });
                done();
            }, wait);
        });
    });

    describe('When configuration is manually modified', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        ${domain}
                        ${data}
                        ${components}
                    </script>
                </body>
            </html>
            `;
        let window;
        let document;

        beforeEach(()=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;        
        });

        it('lets that happen', (done)=>{            
            window.store.saveObject('configuration', { title:'Home', 'opening-hours':'11-13' });
            let header = document.querySelector('yop-header');
            header.update();
            
            setTimeout(()=> {
                expect(document.querySelector('yop-header #title').innerHTML).to.equal('Home');
                done();
            }, wait);            
        });
    });

    describe('when configuration is updated', ()=>{
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        ${domain}
                        ${data}
                        store.saveObject('configuration', { title:'Resto' });
                        ${components}
                    </script>
                </body>
            </html>
            `;
        let window;
        let document;

        beforeEach(()=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;        
        })

        it('uses the new title', (done)=>{
            window.store.saveObject('configuration', { title:'Agenda', 'opening-hours':'8-18' });
            window.eventBus.notify('configuration updated')
            setTimeout(()=> {
                expect(document.querySelector('yop-header #title').innerHTML).to.equal('Agenda');
                done();
            }, wait);            
        });

        it('uses new opening hours', (done)=>{
            window.store.saveObject('configuration', { title:'Agenda', 'opening-hours':'8-18' });
            window.eventBus.notify('configuration updated');
            setTimeout(()=> {
                let root = document.documentElement;
                let start = root.style.cssText;
                expect(start).to.equal('--opening-hours-start: 8; --opening-hours-end: 18;');
                done();
            }, wait);
        });
    });
})