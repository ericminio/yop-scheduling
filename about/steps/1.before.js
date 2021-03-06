const { BeforeAll, Before, World } = require('../../app/node_modules/@cucumber/cucumber/lib');
const { Builder, By } = require('../../app/node_modules/selenium-webdriver');
const clear = require('../../app/backend/storage/migrations/clear');
const { Configuration } = require('../../app/domain');
const code = require('fs').readFileSync(require('path').join(__dirname, 'robot.js')).toString();
const Robot = (new Function(`${code}; return Robot`))();

var {setDefaultTimeout} = require('../../app/node_modules/@cucumber/cucumber');
setDefaultTimeout(60 * 1000);

BeforeAll(async ()=>{
    World.driver = await new Builder().forBrowser('firefox').build();
});

Before(async (testCase)=>{
    let maybeLoaded = require.resolve('../../app/start');
    delete require.cache[maybeLoaded];
    let { server, database, ready } = require('../../app/start');
    await ready;
    World.server = server;
    await clear(database);
    World.robot = new Robot(World, By);
});
