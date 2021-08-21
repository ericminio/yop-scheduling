var today = ()=> {
    return new Date();
};

var nextDay = (input)=> {
    let parts = input.split('-');
    let year = parseInt(parts[0]);
    let month = parseInt(parts[1])-1;
    let day = parseInt(parts[2]);
    let incoming = new Date(year, month, day);
    let next = new Date(incoming.getTime() + 1000*60*60*24 * 1);
    return next;
};

var previousDay = (input)=> {
    let parts = input.split('-');
    let year = parseInt(parts[0]);
    let month = parseInt(parts[1])-1;
    let day = parseInt(parts[2]);
    let incoming = new Date(year, month, day);
    let next = new Date(incoming.getTime() - 1000*60*60*24 * 1);
    return next;
};

var formatDate = (date)=> {
    let month = zeroLeft(1+date.getMonth());
    let day = zeroLeft(date.getDate());
    let formatted = `${date.getFullYear()}-${month}-${day}`;
    return formatted;
};
var zeroLeft = (number)=> {
    return number < 10 ? '0'+number : ''+number;
};