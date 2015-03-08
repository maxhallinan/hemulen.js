;(function(){
    'use strict';

    var filesStored     = {},
        usedHashes      = [],
        formSubmitted   = false; 


    //UTILITY

    //Create and dispatch a custom event using one of two techniques, based on browser capability
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

    //Generate a random hash of length equal to the value of the first argument
    function _generateHash(length){
        var hashSource = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'],
            hash = '';

        for (var i = 0; i < length; i++) {
            hash += hashSource[Math.floor(Math.random() * hashSource.length)];
        }

        return hash;
    }

    //Generate a random hash of length equal to the second argument 
    //by calling generator function passed as the first argument.
    //If new hash is equal to a value stored in array passed as the third argument,
    //recurse to generate new hash and check again.
    //Otherwise, return new hash.     
    function _generateUniqueHash(hashGenerator, hashLength, usedHashes){
        var newHash = hashGenerator(hashLength);
 
        return usedHashes.indexOf(newHash) > -1 ? createUniqueHash(hashGenerator, hashLength, usedHashes) : newHash; 
    }



    //EVENT HANDLERS
    function onFileChange(e){}

    function onDragEnter(e){
        e.preventDefault();
        return false;
    }
    
    function onDragLeave(e){
        e.preventDefault();
        return false;
    }
    
    function onDragOver(e){
        e.preventDefault();
        e.dataTransfer.dropEffect = 'all';
        return false;
    }
    
    function onDrop(e){
        e.preventDefault();
    }
    
    function onSub(e){
        e.preventDefault();
    }


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

        this._instanceEl = document.querySelectorAll(element);

        function _extend(options){
            for (var key in options) {
                if(options[key].constructor === Object) {
                    _extend.call(this[key], options[key])
                } else {
                    if(this.hasOwnProperty(key)) {
                        this[key] = options[key];
                    }
                }
            }
        }

        if (options) {_extend.call(this, options);}

        this._init();
    }

    //HEMULEN METHODS

    Hemulen.prototype._bindEventListeners = function(){
        var i,j,k,l;

        for (i = 0, j = this._instanceEl.length; i < j; i++) {
            var el          = this._instanceEl[i], 
                dropInput   = el.querySelectorAll(this.dropInput),
                fileInput   = el.querySelectorAll(this.fileInput);

            //when event handlers are called,
            //they will be called with the context of the Hemulen instance and not the event object
            onSub           = onSub.bind(this);
            onFileChange    = onFileChange.bind(this);
            onDragEnter     = onDragEnter.bind(this);
            onDragLeave     = onDragLeave.bind(this);
            onDragOver      = onDragOver.bind(this);
            onDrop          = onDrop.bind(this);

            //bind submit event
            for (k = 0, l = fileInput.length; k < l; k++) {
                // dropForm[k].addEventListener('submit', onSub, false);
            }

            //bind change event
            for (k = 0, l = fileInput.length; k < l; k++) {
                fileInput[k].addEventListener('change', onFileChange, false);
            }

            //bind drag/drop events
            for (k = 0, l = dropInput.length; k < l; k++) {
                dropInput[k].addEventListener('dragenter', onDragEnter, false);
                dropInput[k].addEventListener('dragleave', onDragLeave, false);
                dropInput[k].addEventListener('dragover', onDragOver, false);
                dropInput[k].addEventListener('drop', onDrop, false);
                dropInput[k].addEventListener('dragdrop', onDrop, false);
            }
        }
    };

    Hemulen.prototype._init = function(){
        this._bindEventListeners();
    };

    //EXPORT HEMULEN
    if (typeof module !== "undefined" && module !== null) {
        module.exports = Hemulen;
    } else {
        window.Hemulen = Hemulen;
    }

})();


//INSTANCES

var ddFull = new Hemulen('.js-dd--full', {
    namespace: 'ddfull',
    dropInput: '.js-dd__field',
    fileInput: '.js-dd__file-inpt',
    acceptTypes: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/bmp'],
    fileMaxSize: 5000000,
    fileLimit: 10,
    beforeSub: function(){console.log('before sub');},
    onSubFail: function(){console.log('on sub fail');},
    onSubSuccess: function(){console.log('after sub');}
});
console.log(ddFull);

var ddThumb = new Hemulen('.js-dd--thumb', {
    namespace: 'ddthumb',
    dropInput: '.js-dd__field',
    fileInput: '.js-dd__file-inpt',
    acceptTypes: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/bmp'],
    fileMaxSize: 5000000,
    fileLimit: 5,
    beforeSub: function(){console.log('before sub');},
    onSubFail: function(){console.log('on sub fail');},
    onSubSuccess: function(){console.log('after sub');}
});
console.log(ddThumb);

var ddSingle = new Hemulen('.js-dd--single', {
    namespace: 'ddsingle',
    dropInput: '.js-dd__field',
    fileInput: '.js-dd__file-inpt',
    acceptTypes: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/bmp'],
    fileMaxSize: 5000000,
    fileLimit: 1,
    beforeSub: function(){console.log('before sub');},
    onSubFail: function(){console.log('on sub fail');},
    onSubSuccess: function(){console.log('after sub');}
});
console.log(ddSingle);