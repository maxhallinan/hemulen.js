//This test tested in IE8, IE9, IE10
if (typeof CustomEvent === 'function') {
    console.log('CustomEvent === \'function\'');
} else {
    console.log('CustomEvent !== \'function\'');
}

//IE9+
var _customEvent = (function(){
    if (typeof CustomEvent === 'function') {
        return function(eventtarget, eventname, eventbubbles, eventcancelable, eventdetail){
            var ev = new CustomEvent(eventname, {
                detail: eventdetail,
                bubbles: eventbubbles,
                cancelable: eventcancelable
            });
            eventtarget.dispatchEvent(ev);
        };
    } else {
        return function(eventtarget, eventname, eventbubbles, eventcancelable, eventdetail){
            var ev = document.createEvent('Event');
            ev.initEvent(eventname, eventbubbles, eventcancelable);
            if (eventdetail) {ev.detail = eventdetail;}
            eventtarget.dispatchEvent(ev);
        }
    }
})();


var eventtarg = document.getElementById('testform');
function testHandler(e){
    console.log(e);
    console.log(e.type);
    console.log(e.detail.foo); 
    console.log('testfired');
}
if (eventtarg.addEventListener) {
    eventtarg.addEventListener('testEvent', testHandler, false);
} else {
    eventtarg.attachEvent('testEvent', testHandler);
}
_customEvent(eventtarg, 'testEvent', true, true, {'foo':'bar'});
