;(function(){
    'use strict';

    var filesStored     = {},
        usedHashes      = [],
        formSubmitted   = false; 





    //UTILITY

    //Create and dispatch a custom event using one of two techniques, based on browser capability
    //Parameters: eventtarget (element node), eventname (string), eventbubbles (boolean), eventcancelable (boolean), eventdetail (object)
    var _createEvent = (function(){
        if (typeof CustomEvent === 'function') {
            return function(eventname, eventbubbles, eventcancelable, eventdetail){
                var ev = new CustomEvent(eventname, {
                    detail: eventdetail,
                    bubbles: eventbubbles,
                    cancelable: eventcancelable
                });
                return ev;
            };
        } else {
            //IE9+
            return function(eventname, eventbubbles, eventcancelable, eventdetail){
                var ev = document.createEvent('Event');
                ev.initEvent(eventname, eventbubbles, eventcancelable);
                if (eventdetail) {ev.detail = eventdetail;}
                return ev;
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
 
        return usedHashes.indexOf(newHash) > -1 ? _generateUniqueHash(hashGenerator, hashLength, usedHashes) : newHash; 
    }

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
        
        var thisHemulen = e.target.closest(this.hemulen),
            instanceId  = this.getInstanceId(thisHemulen),
            files       = e.dataTransfer.files,
            range       = this._setUploadLimit(instanceId, files); 

            for (var i = range.start; i < range.end; i++) {
                if ( this._validFile(files[i - range.start]) ) {
                    this._storeFile(instanceId, file);
                }
            }

        return false;
    }
    
    function onSub(e){
        e.preventDefault();
    }





    //HEMULEN CLASS

    function Hemulen(element, options){
        this.hemulen        = undefined;
        this.namespace      = undefined;
        this.dropInput      = undefined;
        this.fileInput      = undefined;
        this.acceptTypes    = undefined;
        this.fileMaxSize    = undefined;
        this.fileLimit      = undefined;
        this.beforeSub      = undefined;
        this.onSubFail      = undefined;
        this.onSubSuccess   = undefined;

        if (options) {_extend.call(this, options);}

        this._init();
    }





    //HEMULEN METHODS

    Hemulen.prototype._init = function(){
        var els = document.querySelectorAll(this.hemulen);
        this._instances = {};
        filesStored[this.namespace] = {};

        for (var i = 0, l = els.length, instanceId; i < l; i++) {
            instanceId = _generateUniqueHash(_generateHash, 7, usedHashes);
            this._instances[instanceId] = els[i];
            filesStored[this.namespace][instanceId] = {};
        }

        //when event handlers are called,
        //they will be called with the context of the Hemulen instance and not the event object
        _onSub           = _onSub.bind(this);
        _onFileChange    = _onFileChange.bind(this);
        _onDragEnter     = _onDragEnter.bind(this);
        _onDragLeave     = _onDragLeave.bind(this);
        _onDragOver      = _onDragOver.bind(this);
        _onDrop          = _onDrop.bind(this);

        // _storeFile       = _storeFile.bind(this);
        // _setUploadLimit  = _setUploadLimit.bind(this);
        // _validFile       = _validFile.bind(this);   

        this._bindEventListeners();
    };

    Hemulen.prototype._bindEventListeners = function(){
        var i, j, k, l, key, el, dropInput, fileInput;

        for (key in this._instances) {
            el          = this._instances[key], 
            dropInput   = el.querySelectorAll(this.dropInput),
            fileInput   = el.querySelectorAll(this.fileInput);


            //bind submit event
            //place event binding here

            //bind change event
            for (k = 0, l = fileInput.length; k < l; k++) {
                fileInput[k].addEventListener('change', onFileChange, false);
            }

            //bind drag/drop events
            for (k = 0, l = dropInput.length; k < l; k++) {
                dropInput[k].addEventListener('dragenter', _onDragEnter, false);
                dropInput[k].addEventListener('dragleave', _onDragLeave, false);
                dropInput[k].addEventListener('dragover', _onDragOver, false);
                dropInput[k].addEventListener('drop', _onDrop, false);
                dropInput[k].addEventListener('dragdrop', _onDrop, false);
            }
          
        }
    };

    Hemulen.prototype.getInstanceId = function(element){
        for (var key in this._instances) {
            if (this._instances[key] === element) {
                return key;
            } else {
                return undefined;
            }
        }
    };

    function _setUploadLimit(instanceId, files){
        var instance            = this._instances[instanceId];
            filesStoredLength   = Object.keys(dataStored[instanceId]).length,
            filesLength         = files.length,
            filesLimit          = this.fileLimit - filesStoredLength,
            range               = {},
            ev, eventDetail, s;

            if (filesLength > filesLimit) {
                eventDetail = {
                    instance: instance,
                    instanceId: instanceId,
                    files: files,
                    hemulen: this
                },
                ev = _createEvent('hemulen-toomany', true, true, eventDetail);;  

                range.start = 0;
                range.end   = 0;
                return range;
            } else if (filesStoredLength === 0) {
                range.start = 0;
                range.end   = filesLength > this.fileLimit ? this.fileLimit : filesLength;  
            } else if {
                s = range.start + filesLength;
                range.start = filesStoredLength;
                range.end   = this.fileLimit < s ? this.fileLimit : s; 
            }

            return range;
    }

    function _validFile(instanceId, file){
        var isValidType = this.acceptTypes.indexOf(file.type) > -1,
            isValidSize = file.size < this.fileMaxSize,
            instance    = this._instances[instanceId], 
            eventDetail = {
                instance: instance,
                instanceId: instanceId,
                file: file,
                hemulen: this
            },
            ev;

            if (isValidType && isValidSize) {
                return true;
            } else if (!isValidType && !isValidSize) {
                ev = _createEvent('hemulen-wrongtype', true, true, eventDetail);
                instance.dispatchEvent(ev);
                ev = _createEvent('hemulen-toobig', true, true, eventDetail);
                instance.dispatchEvent(ev);
                return false;
            } else if (!isValidType && isValidSize) {
                ev = _createEvent('hemulen-wrongtype', true, true, eventDetail);
                instance.dispatchEvent(ev);
                return false;
            } else if (isValidType && !isValidSize) {
                ev = _createEvent('hemulen-toobig', true, true, eventDetail);
                instance.dispatchEvent(ev);
                return false;
            }
    }

    Hemulen.prototypes._storeFile = function(instanceId, file){
        var fileId = _generateUniqueHash(_generateHash, 7, usedHashes);

        filesStored[this.namespace][instanceId][fileId] = file; 
        
        if (filesStored[this.namespace][instanceId][fileId] === file) {
            var eventDetail = {
                instance: this._instances[instanceId],
                instanceId: instanceId,
                file: file,
                fileId: fileId,
                hemulen: this
            },
            ev = _createEvent('hemulen-filestored', true, true, eventDetail);
            this._instances[instanceId].dispatchEvent(ev);
        } else {
            return null;
        }
    };


    //EXPORT HEMULEN
    if (typeof module !== "undefined" && module !== null) {
        module.exports = Hemulen;
    } else {
        window.Hemulen = Hemulen;
    }

})();


//INSTANCES

var ddFull = new Hemulen({
    hemulen: '.js-dd--full',
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

var ddThumb = new Hemulen({
    hemulen: '.js-dd--thumb',
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

var ddSingle = new Hemulen({
    hemulen: '.js-dd--single',
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