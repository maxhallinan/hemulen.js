//binds function Baz to the global namespace
(function(){
    function EventEmmiter(){}

    EventEmmiter.prototype.helloWorld = function(){console.log('hello world');};

    function Hemulen(element, options){
        console.log('element: ', element);
        console.log('options: ', options);
    }

    Hemulen.prototype = Object.create(EventEmmiter.prototype);

    Hemulen.prototype.constructor = Hemulen;

    Hemulen.prototype.goodbyeWorld = function(){console.log('goodbye world')};
    
    if (typeof module !== "undefined" && module !== null) {
        module.exports = Hemulen;
    } else {
        window.Hemulen = Hemulen;
    }

})();

var baz = new Hemulen('body', {'hello':'world'});
baz.helloWorld();
baz.goodbyeWorld();