;(function(){
    'use strict';

    //MODULE GLOBALS
    var forms       = [];
    var formEls     = false;
    var usedHashes  = [];



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
            if( (typeof options[key]).toLowerCase() === 'object' && options[key].constructor !== Array ) {
                _extend.call(this[key], options[key])
            } else {
                if(options.hasOwnProperty(key)) {
                    this[key] = options[key];
                }
            }
        }
    }

    function _closest(ele, selector) {
        var possibles = document.querySelectorAll(selector);

        return (function traverseUp(el){
            for (var i = 0, j = possibles.length; i < j; i++) {
                if (possibles[i] === el) {
                    return el;
                }
            }
            return traverseUp(el.parentNode);
        }(ele));
   
    }

    function _createSubData(storedData, formData){
        // |- Hemulen File Storage object
        // |   |- namespace
        // |   |   |- hemulenElId
        // |   |   |   |- fileId
        // |   |   |   |   |- file
        // |   |   |   |   |- foo
        // |   |   |   |   |- bar

        var propname    = '';
        var counterA    = 0;
        var counterB    = 0;

            for (var foo in storedData) {
                if (storedData.hasOwnProperty(foo)){
                    propname    = foo;
                    
                    if ( (typeof storedData[foo]).toLowerCase() === 'object' && storedData[foo].constructor !== Array) {
                        for (var bar in storedData[foo]) {
                            if (storedData[foo].hasOwnProperty(bar)) {
                                
                                if ( (typeof storedData[foo][bar]).toLowerCase() === 'object' && storedData[foo][bar].constructor !== Array ) {    
                                    for (var baz in storedData[foo][bar]) {
                                        if (storedData[foo][bar].hasOwnProperty(baz)) {
                                            
                                            if ( (typeof storedData[foo][bar][baz]).toLowerCase() === 'object' && storedData[foo][bar][baz].constructor !== Array ) {
                                                for (var qux in storedData[foo][bar][baz]) {
                                                    if(storedData[foo][bar][baz].hasOwnProperty(qux)) {
                                                        formData.append((propname + counterA + qux + counterB), storedData[foo][bar][baz][qux]);
                                                    }
                                                }
                                
                                                counterB++;
                                            }

                                          
                                        }
                                    }
                                
                                    counterA++;  
                                    counterB = 0;
                                }
                                                      
                            }
                        }
                    }

                    counterA = 0;
                }
            }

            return formData;
    }

    function _getFormIndex(form){
        for (var i = 0, j = forms.length; i < j; i++) {
            if (forms[i].form === form) {return i;}
        }        
        return -1;
    }




    //EVENT HANDLERS

    function _onFileChange(e){
        this.storeFiles(this.getHemulenElId(_closest(e.target, this.hemulenEl)), e.target.files);
    }

    function _onDragEnter(e){
        e.preventDefault && e.preventDefault();
        return false;
    }
    
    function _onDragLeave(e){
        e.preventDefault && e.preventDefault();
        return false;
    }
    
    function _onDragOver(e){
        e.preventDefault && e.preventDefault();
        e.dataTransfer.dropEffect = 'all';
        return false;
    }
    
    function _onDrop(e){
        e.preventDefault && e.preventDefault();
        this.storeFiles(this.getHemulenElId(_closest(e.target, this.hemulenEl)), e.dataTransfer.files);
        return false;
    }
    
    function _onSub(e){
        var i, j; 
        var formIndex = _getFormIndex(e.target);

        e.preventDefault && e.preventDefault();
        
        if (!forms[formIndex].formSubmitted) {
            for (i = 0, j = forms[formIndex].beforeSub.length; i < j; i++) {forms[formIndex].beforeSub[i](e, this);}
            this._subData(e.target);
        }
        forms[formIndex].formSubmitted = true;
    }





    //HEMULEN CLASS

    function Hemulen(options){
        this.hemulenEl      = undefined;
        this.namespace      = undefined;
        this.dropInput      = undefined;
        this.fileInput      = undefined;
        this.acceptTypes    = undefined;
        this.fileMaxSize    = undefined;
        this.fileLimit      = undefined;
        this.beforeSub      = undefined;

        if (!options || (typeof options).toLowerCase() !== 'object' || options.constructor === Array) {
            throw new Error('Invalid Hemulen configuration.');
        } else {
            _extend.call(this, options);
        }
        
        if (!this.hemulenEl || this.hemulenEl.constructor !== String){throw new Error('hemulenEl is a required configuration option and must be a CSS selector string.');}
        if (!this.dropInput || this.dropInput.constructor !== String){throw new Error('dropInput is a required configuration option and must be a CSS selector string.');}
        if (!this.namespace || this.namespace.constructor !== String){throw new Error('namespace is a required configuration option and must be a CSS selector string.');}

        this._init();
    }





    //HEMULEN "PRIVATE" METHODS

    Hemulen.prototype._formInit = function(){
        var i, j;

        formEls = document.getElementsByTagName('form');

        for (i = 0, j = formEls.length; i < j; i++) {
            forms.push({
                beforeSub: [],
                filesStored: {},
                form: formEls[i],
                formSubmitted: false
            });
        }

    };

    Hemulen.prototype._init = function(){
        var a, b, i, l;
        var els;
        var hemulenElId;

        if (formEls === false) {this._formInit();}

        this._instances = {};

        for (var a = 0, b = formEls.length; a < b; a++) {
            els = formEls[a].querySelectorAll(this.hemulenEl);

            if (els.length) {
                forms[a].filesStored[this.namespace] = forms[a].filesStored[this.namespace] || {};
            
                for (i = 0, l = els.length; i < l; i++) {
                    hemulenElId = _generateUniqueHash(_generateHash, 7, usedHashes);
                    this._instances[hemulenElId] = els[i];
                    forms[a].filesStored[this.namespace][hemulenElId] = forms[a].filesStored[this.namespace][hemulenElId] || {};
                }

                if (this.beforeSub && this.beforeSub.constructor === Function){forms[a].beforeSub.push(this.beforeSub);}
            
                this._bindEventListeners(formEls[a], els);

            }
        }   
    };

    Hemulen.prototype._bindEventListeners = function(form, hemulenEls){
        var i, j, k, l;
        var dropInput;
        var fileInput;

        //bind submit event
        form.addEventListener('submit', _onSub.bind(this), false);

        for (i = 0, j = hemulenEls.length; i < j; i++) {
            dropInput = hemulenEls[i].querySelectorAll(this.dropInput);
            fileInput = hemulenEls[i].querySelectorAll(this.fileInput);

            //bind change event
            for (k = 0, l = fileInput.length; k < l; k++) {
                fileInput[k].addEventListener('change', _onFileChange.bind(this), false);
            }

            //bind drag/drop events
            for (k = 0, l = dropInput.length; k < l; k++) {
                dropInput[k].addEventListener('dragenter', _onDragEnter.bind(this), false);
                dropInput[k].addEventListener('dragleave', _onDragLeave.bind(this), false);
                dropInput[k].addEventListener('dragover', _onDragOver.bind(this), false);
                dropInput[k].addEventListener('drop', _onDrop.bind(this), false);
                dropInput[k].addEventListener('dragdrop', _onDrop.bind(this), false);
            }
        }
    };

    Hemulen.prototype._setUploadLimit = function(hemulenElId, files){
        var hemulenEl           = this._instances[hemulenElId];
        var form                = _closest(hemulenEl, 'form');
        var formIndex           = _getFormIndex(form);
        var filesStoredLength   = Object.keys(forms[formIndex].filesStored[this.namespace][hemulenElId]).length;
        var filesLength         = files.length;
        var filesLimit          = this.fileLimit - filesStoredLength;
        var range               = {};
        var ev;
        var s;

        if (filesLength > filesLimit) {
            ev              = _createEvent('hemulen-toomany', true, true);
            ev.files        = files;
            ev.hemulen      = this;
            ev.hemulenElId  = hemulenElId;

            hemulenEl.dispatchEvent(ev);

            range.start = 0;
            range.end   = 0;
            return range;
        } else if (filesStoredLength === 0) {
            range.start = 0;
            range.end   = filesLength > this.fileLimit ? this.fileLimit : filesLength;  
        } else if (filesStoredLength < this.fileLimit && filesStoredLength > 0) {
            range.start = filesStoredLength;
            s = range.start + filesLength;
            range.end   = this.fileLimit < s ? this.fileLimit : s; 
        }

        return range;
    };

    Hemulen.prototype._validFile = function(hemulenElId, file){
        var isValidType = this.acceptTypes ? this.acceptTypes.indexOf(file.type) > -1 : true;
        var isValidSize = this.fileMaxSize ? this.fileMaxSize > file.size : true;
        var instance    = this._instances[hemulenElId];

        if (isValidType && isValidSize) {
            return true;
        } else if (!isValidType && !isValidSize) {
            return ['too big', 'wrong type'];
        } else if (!isValidType && isValidSize) {
            return ['wrong type'];
        } else if (isValidType && !isValidSize) {
            return ['too big'];
        }
    };

    Hemulen.prototype._storeFile = function(hemulenElId, file){
        var fileId              = _generateUniqueHash(_generateHash, 7, usedHashes);
        var hemulenEl           = this._instances[hemulenElId];
        var form                = _closest(hemulenEl, 'form');
        var formIndex           = _getFormIndex(form);
        var ev;

        forms[formIndex].filesStored[this.namespace][hemulenElId][fileId] = {};
        forms[formIndex].filesStored[this.namespace][hemulenElId][fileId]['file'] = file; 
        
        if (forms[formIndex].filesStored[this.namespace][hemulenElId][fileId]['file'] === file) {
            ev              = _createEvent('hemulen-filestored', true, true);
            ev.file         = file;
            ev.fileId       = fileId;
            ev.hemulen      = this;
            ev.hemulenElId  = hemulenElId;

            hemulenEl.dispatchEvent(ev);
        } else {
            return null;
        }
    };

    Hemulen.prototype._subData = function(form){
        var formIndex           = _getFormIndex(form);
        var req     = new XMLHttpRequest();
        var route   = form.getAttribute('action');
        var formIndex = _getFormIndex(form);

        req.onreadystatechange = function(){
            if (req.readyState === 4) {
                var ev;
                
                ev = req.status === 200 ?   _createEvent('hemulen-subsuccess', true, true) : 
                                            _createEvent('hemulen-subfailure', true, true);

                ev.hemulenRequest = req;                            

                form.dispatchEvent(ev);
                
                forms[formIndex].formSubmitted = false;            
            }
        };

        req.open('POST', route, true);
        req.send( _createSubData(forms[formIndex].filesStored, new FormData(form)) );
    };


    //HEMULEN "PUBLIC" METHODS

    Hemulen.prototype.getHemulenElId = function(element){

        if (!element || typeof element !== 'object' || !element.nodeType || element.nodeType !== 1) {
            throw new Error('The first argument must be an element node');
        }

        for (var key in this._instances) {
            if (this._instances[key] === element) {
                return key;
            }
        }

        return undefined;
    };

    Hemulen.prototype.getFileId = function(hemulenElId, file){
        var hemulenEl;
        var form;
        var formIndex;

        if (!hemulenElId || hemulenElId.constructor !== String) {throw new Error('This is an invalid value: ', hemulenElId);}
        
        hemulenEl           = this._instances[hemulenElId];
        form                = _closest(hemulenEl, 'form');
        formIndex           = _getFormIndex(form);

        for (var key in forms[formIndex].filesStored[hemulenElId]) {
            if (forms[formIndex].filesStored[hemulenElId][key][file] === file) {
                return key;
            } 
        }

        return undefined;
    };

    Hemulen.prototype.deleteFile = function(hemulenElId, fileId){
        var ev;
        var hemulenEl           = this._instances[hemulenElId];
        var form                = _closest(hemulenEl, 'form');
        var formIndex           = _getFormIndex(form);

        if (!hemulenElId || hemulenElId.constructor !== String) {throw new Error('This is an invalid value: ', hemulenElId);}
        if (!hemulenElId || hemulenElId.constructor !== String) {throw new Error('This is an invalid value: ', fileId);}
        
        delete forms[formIndex].filesStored[this.namespace][hemulenElId][fileId];

        if (!forms[formIndex].filesStored[this.namespace][hemulenElId][fileId]) {

            ev = _createEvent('hemulen-filedeleted', true, true);

            ev.fileId       = fileId;
            ev.hemulen      = this;
            ev.hemulenElId  = hemulenElId;

            hemulenEl.dispatchEvent(ev);            
        }

        return false;
    };

    Hemulen.prototype.storeFiles = function(hemulenElId, files){
        var range, valid;
        var ev;
        var errors = [];

        if (!hemulenElId || hemulenElId.constructor !== String) {throw new Error('This is an invalid value: ', hemulenElId);}

        range = this.fileLimit ? this._setUploadLimit(hemulenElId, files) : {start: 0, end: files.length}; 

        for (var i = range.start; i < range.end; i++) {
            valid = this._validFile(hemulenElId, files[i - range.start]); 
            
            if ( valid === true ) {
                this._storeFile(hemulenElId, files[i - range.start]);
            } else {
                for (var l = 0, m = valid.length; l < m; l++) {
                    errors.push({
                        errorType: valid[l],
                        file: files[i - range.start]
                    });
                }
            }   
        }

        if (errors.length) {            
            ev = _createEvent('hemulen-invalid', true, true);
            
            ev.hemulenErrors    = errors;
            ev.hemulen          = this;
            ev.hemulenElId      = hemulenElId;

            this._instances[hemulenElId].dispatchEvent(ev); 
        }
    };

    Hemulen.prototype.addData = function(hemulenElId, fileId, updates){
        var hemulenEl;
        var form;
        var formIndex;

        if (!hemulenElId || hemulenElId.constructor !== String) {throw new Error('This is an invalid value: ', hemulenElId);}
        if (!fileId || fileId.constructor !== String) {throw new Error('This is an invalid value: ', fileId);}
        if (!updates || (typeof updates === 'Object' && updates.constructor === Array) ) {throw new Error('This is an invalid value: ', updates);}
        
        hemulenEl           = this._instances[hemulenElId];
        form                = _closest(hemulenEl, 'form');
        formIndex           = _getFormIndex(form);

        for (var prop in updates) {
            if (updates.hasOwnProperty(prop) && ( (typeof updates[prop]).toLowerCase() === 'object') ) {
                throw new Error('The third argument is invalid. Values stored on the object must be primitives.');
            }
        }

        _extend.call(forms[formIndex].filesStored[this.namespace][hemulenElId][fileId], updates);        
    };





    //TEST FOR BROWSER API DEPENDENCIES
    function _testDragDrop(testElement) { 
        var testEl = testElement || document.createElement('div');
        return ('draggable' in testEl) || ('ondragstart' in testEl && 'ondrop' in testEl);
    }

    function _testFileAPI(testEnvironment) {
        // file tests for the File API specification
        // Tests for objects specific to the File API W3C specification without
        // being redundant (don't bother testing for Blob since it is assumed
        // to be the File object's prototype.
        
        // Will fail in Safari 5 due to its lack of support for the standards
        // defined FileReader object

        var testEnv = testEnvironment || window;
        return !!(testEnv.File && testEnv.FileList && testEnv.FileReader);
    }

    Hemulen.prototype._testBrowserApis = function(options){
        var testElement     = options ? options.testElement : undefined;
        var testEnvironment = options ? options.testEnvironment : undefined;
         
        var dragDropIsSupported = _testDragDrop(testElement);
        var fileAPIIsSupported  = _testFileAPI(testEnvironment);

        if (!dragDropIsSupported || !fileAPIIsSupported ) {
            document.documentElement.classList.add('hemulen-incompatible');        
        }        
    };

    Hemulen.prototype._testBrowserApis();









    //EXPORT HEMULEN
    if (typeof module !== "undefined" && module !== null) {
        module.exports = Hemulen;
    } else {
        window.Hemulen = Hemulen;
    }

})();