module.exports = {
    SecurityRoute: require('./security-route'),

    Ping: require('./ping'),
    Yop: require('./yop'),
    Scripts: require('./scripts'),
    Styles: require('./styles'),
    SignIn: require('./sign-in'),

    GetAllEvents: require('./events/get-all-events'),
    CreateOneEvent: require('./events/create-one-event'),
    GetOneEvent: require('./events/get-one-event'),
    DeleteOneEvent: require('./events/delete-one-event'),

    GetAllResources: require('./resources/get-all-resources'),
    CreateOneResource: require('./resources/create-one-resource'),
    GetOneResource: require('./resources/get-one-resource'),
    DeleteOneResource: require('./resources/delete-one-resource'),

    DefaultRoute: require('./defaut-route')
};