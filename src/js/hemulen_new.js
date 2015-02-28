(function(){
    function Emmiter(){
        this.helloWorld = function(){console.log('hello world');};
    };

    function Hemulen(){}

    Hemulen.prototype = Emmiter.prototype;



    var Super, Baz
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { 
          for (var key in parent) { 
            if (__hasProp.call(parent, key)) { 
              child[key] = parent[key]; 
            }
          } 

          function ctor() { 
            this.constructor = child; 
          } 

          ctor.prototype = parent.prototype; 

          child.prototype = new ctor(); 

          child.__super__ = parent.prototype; 

          return child; 
        };

    Super = (function(){
        function Super(){}
        Super.prototype.helloWorld = function(){console.log('hello world!')};
        return Super;
    })();

    Baz = (function(_super){

        __extends(Baz, _super);

        Baz.prototype.config = {
            'foo' : 'bar'
        };

        function Baz(element, options){
            this.element = element;
            if (typeof this.element === "string") {
                this.element = document.querySelector(this.element);
            }
            console.log('Baz(), element: ', this.element);
            console.log('Baz(), options: ', options);
        }

        return Baz;
    })(Super);

    if (typeof module !== "undefined" && module !== null) {
        module.exports = Baz;
    } else {
        window.Baz = Baz;
    }

}).call(this);

var baz = new Baz('body', {'hello':'yay'});


