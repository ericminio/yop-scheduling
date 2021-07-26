const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'header.js')).toString()
    ;

describe('Header', ()=>{

    describe('When configuration is already avalable', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        store.saveObject('configuration', { title:'Resto' });
                        ${sut}
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

        it('uses the available title', ()=>{
            expect(document.querySelector('yop-header #title').innerHTML).to.equal('Resto');
        });
    });

    describe('When configuration is not already avalable', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        var api = {
                            configuration: ()=> new Promise((resolve)=>{ resolve({
                                title: 'Agenda'
                            }); })  
                        };
                        ${sut}
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
            }, 50);
        });

        it('stores it', (done)=>{
            setTimeout(()=> {
                expect(window.store.getObject('configuration')).to.deep.equal({ title:'Agenda' });
                done();
            }, 50);
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
                        ${sut}
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

        it('lets that happen', ()=>{
            window.store.saveObject('configuration', { title:'Home' });
            let header = document.querySelector('yop-header');
            header.update();
            
            expect(document.querySelector('yop-header #title').innerHTML).to.equal('Home');
        });
    });
})