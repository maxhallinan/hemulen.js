//binds function Baz to the global namespace
(function(){
    'use strict';

    var filesStored     = {},
        usedHashes      = [],
        formSubmitted   = false,
        __slice         = [].slice; 

    //EVENT EMITTER CLASS
    function EventEmitter(){}

    EventEmitter.prototype.addEventListener = EventEmitter.prototype.on;

    //Event binding
    EventEmitter.prototype.on = function(event, fn) {
        //check for a _callbacks property on this instance of the EventEmitter class
        //if this instance doesn't have the _callbacks property,
        //create that property instance of the EventEmitter class
        this._callbacks = this._callbacks || {};
        
        //check if event has already been bound to this instance
        //if not, create bind event
        if (!this._callbacks[event]) {
            this._callbacks[event] = [];
        }
        
        //store event callback in the callbacks object
        this._callbacks[event].push(fn);
    };

    //Event emitting
    //Emit an event passed as the first argument
    //Execute all callbacks stored in the _callbacks property of this
    EventEmitter.prototype.emit = function(){
       var args, callback, callbacks, event, _i, _len;

        //event is the first item in the arguments object
        event = arguments[0];

        //if there is more than 1 argument, assign args the first argument
        //if there is 1 argument or less, assign args an empty array
        args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];

        //check for the _callbacks property, create it if it doesn't exist
        this._callbacks = this._callbacks || {};

        //get the callbacks for the associated event from the callbacks array
        callbacks = this._callbacks[event];

        if(callbacks) {
            for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
                callback = callbacks[_i];
                callback.apply(this, args);
            }
        }
        return this;
    };

    EventEmitter.prototype.helloWorld = function(){console.log(this.namespace);};

    //HEMULEN CLASS
    function Hemulen(element, options){
        this.namespace      = '';
        this.dropInput      = '';
        this.fileInput      = '';
        this.acceptTypes    = [];
        this.fileMaxSize    = 0;
        this.fileLimit      = 0;
        this.beforeSub      = function(){};
        this.onSubFail      = function(){};
        this.onSubSuccess   = function(){};

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

    //Hemulen inherits from EventEmitter
    Hemulen.prototype = Object.create(EventEmitter.prototype);
    Hemulen.prototype.constructor = Hemulen;

    //HEMULEN METHODS
    Hemulen.prototype.goodbyeWorld = function(){console.log(this.namespace)};


    //EXPORT HEMULEN
    if (typeof module !== "undefined" && module !== null) {
        module.exports = Hemulen;
    } else {
        window.Hemulen = Hemulen;
    }

})();

var baz = new Hemulen('body', {'namespace':'test'});
baz.helloWorld();
baz.goodbyeWorld();
baz.on('hemulen-upload', function(){console.log('hemulen-upload')});
baz.emit('hemulen-upload');