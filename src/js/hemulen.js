//binds function Baz to the global namespace
(function(){
    'use strict';

    var filesStored     = {},
        usedHashes      = [],
        formSubmitted   = false,
        __slice         = [].slice; 


    //UTILITY

    //Create and dispatch a custom event
    //Parameters: eventtarget (element node), eventname (string), eventbubbles (boolean), eventcancelable (boolean), eventdetail (object)
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
            //IE9+
            return function(eventtarget, eventname, eventbubbles, eventcancelable, eventdetail){
                var ev = document.createEvent('Event');
                ev.initEvent(eventname, eventbubbles, eventcancelable);
                if (eventdetail) {ev.detail = eventdetail;}
                eventtarget.dispatchEvent(ev);
            }
        }
    })();



    //HEMULEN CLASS
    function Hemulen(element, options){
        this.namespace      = undefined;
        this.dropInput      = undefined;
        this.fileInput      = undefined;
        this.acceptTypes    = undefined;
        this.fileMaxSize    = undefined;
        this.fileLimit      = undefined;
        this.beforeSub      = undefined;
        this.onSubFail      = undefined;
        this.onSubSuccess   = undefined;

        function extend(options){
            for (var key in options) {
                if(options[key].constructor === Object) {
                    extend.call(this[key], options[key])
                } else {
                    if(this.hasOwnProperty(key)) {
                        this[key] = options[key];
                    }
                }
            }
        }

        if (options) {extend.call(this, options);}

    }

    //HEMULEN METHODS
    Hemulen.prototype.goodbyeWorld = function(){console.log(this.namespace)};


    //EXPORT HEMULEN
    if (typeof module !== "undefined" && module !== null) {
        module.exports = Hemulen;
    } else {
        window.Hemulen = Hemulen;
    }

})();