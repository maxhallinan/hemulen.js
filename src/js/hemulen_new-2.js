//binds function Baz to the global namespace
(function(){
    var filesStored     = {},
        usedHashes      = [],
        formSubmitted   = false; 

    //EVENT EMITTER CLASS
    function EventEmmiter(){}

    EventEmmiter.prototype.helloWorld = function(){console.log(this.namespace);};

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
    Hemulen.prototype = Object.create(EventEmmiter.prototype);
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