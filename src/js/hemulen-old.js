(function($, AppName, undefined){
    'use strict';

    //APP GLOBALS

    var app             = AppName,
        dataStored      = {},
        ddInstances     = [],
        usedHashes      = [],
        formSubmitted   = false;





    //CONFIGURATION

    //Config object constructor
    function Config(options) {

        function customize(config) {
            if ( config && isObj(config) ) {
                for (var prop in config) {
                    if( isObj(config[prop]) ) {
                        customize.call(this[prop], config[prop]);
                    } else {
                        if (this.hasOwnProperty(prop)){
                            this[prop] = config[prop];
                        }
                    }
                }
            } else {
                console.error('The value of the first argument must be an object.');
                return false;
            }
        }

        //default config values
        this.namespace          = '';
        this.namespaceAttr      = 'data-dd-namespace';
        this.instance           = '.js-dd';
        this.instanceIdAttr     = 'data-dd-id';
        this.dropInput          = '.js-dd__field';
        this.fileInput          = '.js-dd__file-inpt';
        this.titleInput         = '.js-dd__title-inpt';
        this.list               = '.js-dd__list';
        this.listItem           = '.js-dd__list-item';
        this.itemIdAttr         = 'data-dd-item-id';
        this.thumbnail          = '.js-dd__thumb';
        this.captionInput       = '.js-dd__capt-inpt';
        this.deleteButton       = '.js-dd__btn-del';
        this.fileName           = '.js-dd__file-name';
        this.errorElement       = '.js-dd__err';
        this.subErrElement      = '.js-dd__sub-err';
        this.title              = true;
        this.caption            = true;
        this.thumbnail          = true;
        this.errMessages = {
            num: 'The number of files you are attempting to upload exceeds the file limit.',
            size: 'This file exceeds the file size limit: ',
            type: 'This file is the wrong file type: ',
            sub: 'There has been a problem with the submission. Please try again.'
        };
        this.validation = {
            acceptTypes: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/bmp'],
            fileLimit: 10,
            fileSize: 5000000
        };
        this.sortable = '.js-sortable';
        this.reorderHandle = '.js-dd__reorder';


        //if instantiated with custom config,
        //override values of respective defaults
        if (options) {customize.call(this, options);}
    };

    function InitSelections(config) {
        this.instance       = $(config.instance);
        this.dropForm       = $(config.instance).closest('form');
        this.dropInput      = this.instance.find(config.dropInput);
        this.fileInput      = this.instance.find(config.fileInput);
        this.errorElement   = this.instance.find(config.errorElement);
        this.dropList       = this.instance.find(config.list);
    }





    //UTILITY

    //Check if value is an object and return a boolean
    function isObj(value) {
        return value.constructor === Object ? true : false;
    }

    function isArray(value) {
        return value.constructor === Array ? true : false;
    }

    //Generate a random hash of length equal to the value of the first argument
    function generateHash(length){
        var hashSource = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'],
            hash = '';

        if (typeof length !== 'number') {
            console.error('This value is not a number: ' + length);
            return false;
        }

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
    function createUniqueHash(hashGenerator, hashLength, usedHashes){
        var newHash;

        if (typeof hashGenerator !== 'function') {
            console.error('The first argument must be a function.');
            return;
        } else if (typeof hashLength !== 'number') {
            console.error('The second argument must be a number.');
            return;
        } else if (usedHashes.constructor !== Array) {
            console.error('The third argument must be an array.');
            return;
        }

        newHash = hashGenerator(hashLength);

        return usedHashes.indexOf(newHash) > -1 ? createUniqueHash(hashGenerator, hashLength, usedHashes) : newHash;
    }





    //DATA WORKERS

    function DataStorage(conf, data) {
        this[conf.namespace + 'data']       = data;

        if (conf.title) {this[conf.namespace + 'title'] = '';}
        if (conf.caption) {this[conf.namespace + 'caption'] = '';}
        if (conf.validation.fileLimit > 1) {this[conf.namespace + 'position'] = undefined;}
    }

    function assignInstanceId(conf){
        //generate unique id for every DOM instance of DD instance
        var instanceId  = createUniqueHash(generateHash, 7, usedHashes);
        usedHashes.push(instanceId);

        //stored id in DOM to be referenced later
        $(this).attr(conf.instanceIdAttr, instanceId);

        //create a place in app global data storage
        //to store data uploaded through instance
        dataStored[instanceId]  = {};
        return instanceId;
    }

    function setDataLimit(e, conf, instanceId, dataStored, dataNew){
        var dataStoredLength    = Object.keys(dataStored[instanceId]).length,
            dataNewLength       = dataNew.length,
            limit               = conf.validation.fileLimit - dataStoredLength,
            range               = {};

            if (dataNewLength > limit) {
                tooMany(conf, $(e.target).closest(conf.instance).find(conf.errorElement));

                range.start = 0;
                range.end   = 0;
                return range;
            } else if (dataStoredLength === 0) {
                range.start = 0;
                range.end   = dataNewLength > conf.validation.fileLimit ? conf.validation.fileLimit : dataNewLength;
            } else if (dataStoredLength < conf.validation.fileLimit && dataStoredLength > 0) {
                range.start = dataStoredLength;
                range.end   = conf.validation.fileLimit < (range.start + dataNewLength) ? conf.validation.fileLimit : (range.start + dataNewLength);
            }

            return range;
    }

    function validData(e,conf,data){
        var isAcceptedType  = conf.validation.acceptTypes.indexOf( data.type ) > -1,
            isAcceptedSize  = data.size < conf.validation.fileSize;

            clearErrors(conf, $(e.currentTarget).find(conf.errorElement));

            if (isAcceptedType && isAcceptedSize) {
                //data is valid
                return true;
            } else if (!isAcceptedType && !isAcceptedSize) {
                //Show error messages
                tooBig(conf, $(e.target).closest(conf.instance).find(conf.errorElement), data);
                wrongType(conf, $(e.target).closest(conf.instance).find(conf.errorElement), data);
                return false;
            } else if (!isAcceptedType && isAcceptedSize) {
                //Show error message
                wrongType(conf, $(e.target).closest(conf.instance).find(conf.errorElement), data);
                return false;
            } else if (isAcceptedType && !isAcceptedSize) {
                //Show error messages
                tooBig(conf, $(e.target).closest(conf.instance).find(conf.errorElement), data);
                return false;
            }
    }

    function storeData(e, conf, instanceId, dataStored, dataNew){
        var dataItemHash, dataLimit, dataNewItem, itemList, range, updatedStorage;

        range           = setDataLimit(e, conf, instanceId, dataStored, dataNew);
        if (range.end === 0) {return dataStored;}
        updatedStorage  = dataStored;
        itemList        = document.createDocumentFragment();


        for (var i = range.start; i < range.end; i++) {
            dataNewItem = dataNew[i - range.start];

            if ( validData(e, conf, dataNewItem) ) {
                dataItemHash = createUniqueHash(generateHash, 7, usedHashes);
                usedHashes.push(dataItemHash);

                updatedStorage[instanceId][dataItemHash] = new DataStorage(conf, dataNewItem);

                itemList.appendChild( listStoredItem(conf, dataNewItem, dataItemHash, i) );
            }
        }

        $(e.currentTarget).closest(conf.instance).find(conf.list).append(itemList);

        if ( conf.validation.fileLimit > 1 ) {
            //DESTROY AND RE-INITIALIZE REORDER PLUGIN
            $(conf.sortable).sortable('destroy');

            $(conf.sortable).sortable({
                forcePlaceholderSize: true,
                handle: conf.reorderHandle
            });
        }


        return updatedStorage;
    }

    function uploadData(e, conf, instanceId, dataNew) {
        dataStored  = storeData(e, conf, instanceId, dataStored, dataNew);
    }

    function storeFieldData(e, conf, fieldName) {
        var $this           = $(e.target),
            $thisInstance   = $this.closest(conf.instance),
            instanceId      = $thisInstance.attr(conf.instanceIdAttr),
            itemId          = $this.closest(conf.listItem).attr(conf.itemIdAttr);

        if (Object.keys(dataStored).length){
            dataStored[instanceId][itemId][conf.namespace + fieldName] = $(e.target).val();
        }

    }

    function deleteData(dataSet, itemId){
        delete dataSet[itemId];

        return dataSet;
    }

    function setPositionValues(instance, prop){
        var conf            = instance[1],
            instanceId      = $(instance[0]).attr(conf.instanceIdAttr),
            $theseItems     = $(instance[0]).find(conf.listItem);

        if ($theseItems.length && conf.validation.fileLimit > 1) {
            $theseItems.each(function(){
                var $this       = $(this),
                    itemId      = $this.attr(conf.itemIdAttr),
                    namespace   = $this.attr(conf.namespaceAttr);
                dataStored[instanceId][itemId][namespace + prop] = $theseItems.index($this);
            });
        }
    };

    function translateDataStored(conf, dataStored, submitData){
        var returnData = submitData,
            counter = -1;

            function iterate(iterateOver){
                for (var key in iterateOver) {
                    if (iterateOver[key].constructor === Object || iterateOver[key].constructor === DataStorage) {
                        if (iterateOver[key].constructor === DataStorage) {
                            if (counter === -1) {
                                counter = 0;
                            } else {
                                counter++;
                            }
                        } else {
                            counter = -1;
                        }
                        iterate(iterateOver[key]);
                    } else {
                        returnData.append(key + counter, iterateOver[key]);
                    }
                }
            }
            iterate(dataStored);

            return returnData;
    }

    function prepareSubData(e, conf) {
        var toSubmit = new FormData(e.target);

        for (var i = 0; i < ddInstances.length; i++) {
            setPositionValues(ddInstances[i], 'position');
        }

        return translateDataStored(conf, dataStored, toSubmit);
    }

    function subData(e, conf, subData, route){
        if (!formSubmitted) {
            console.log('submitting');
            $.ajax({
                success: function(res){
                    formSubmitted = false;
                    subSuccess(e, conf, res);
                },
                error: function(res){
                    formSubmitted = false;
                    subFail(e, conf, res);
                },
                url: route,
                type: 'POST',
                dataType: 'JSON',
                data: subData,
                processData: false,
                contentType: false
            });

            formSubmitted = true;

        }

        return false;
    }






    //DOM WORKERS

    //Returns an img element node with src attribute set
    //to image data passed as the first argument.
    function makeThumbnail(file){
        var thumb = document.createElement('img'),
            reader = new FileReader();

        reader.onload =
            (function(img) {
                return function(e) {
                    img.src = e.target.result;
                };
            })(thumb);

        reader.readAsDataURL(file);

        return thumb;
    }

    function listStoredItem(conf, dataItem, dataItemHash, index){
        var titleHash, captionHash,
            listItem,
            reorder, reorderBtn,
            thumbWrap, thumbCont, thumbFig, thumbFigCapt, thumbFigImg, thumbFigDel,
            fields,
            titleWrap, titleFieldSet, titleLabel1, titleInput, titleLabel2, titleLabel3Span, titleLabel3,
            captionWrap, captionFieldSet, captionLabel1, captionField, captionLabel2, captionLabel3Span, captionLabel3;

        //LIST ITEM
        //create data list item
        listItem = document.createElement('li');

        if (conf.thumbnail) {
            listItem.setAttribute('class', 'row dd__list-item js-dd__list-item');
        } else {
            listItem.setAttribute('class', 'dd__list-item--alt js-dd__list-item');
        }

        listItem.setAttribute(conf.itemIdAttr, dataItemHash);
        listItem.setAttribute(conf.namespaceAttr, conf.namespace);

        //LIST ITEM COMPONENT: REORDER BUTTON
        //if more than one item, create reorder handle

        if (conf.validation.fileLimit > 1) {
            reorderBtn = document.createElement('a');
            reorderBtn.setAttribute('src', '#');
            reorderBtn.setAttribute('class', 'dd__handle sort__handle js-dd__reorder js-sort__handle');
        }

        //LIST ITEM COMPONENT: THUMBNAIL
        thumbWrap = document.createElement('div');
        if (conf.validation.fileLimit > 1) {thumbWrap.setAttribute('class', 'small-6 columns');}

        thumbCont = document.createElement('div');

        if (conf.validation.fileLimit > 1) {
            thumbCont.setAttribute('class', 'dd-thumb__cont');
        } else {
            thumbCont.setAttribute('class', 'dd-thumb__cont--alt');
        }


        thumbFig = document.createElement('div');

        if (conf.thumbnail) {
            thumbFig.setAttribute('class', 'dd__thumb');
        } else {
            thumbFig.setAttribute('class', 'dd__thumb--alt');
        }

        thumbFigCapt = document.createElement('p');
        thumbFigCapt.setAttribute('class', 'dd-list__name');
        thumbFigCapt.textContent = dataItem.name;

        thumbFigDel = document.createElement('a');
        thumbFigDel.setAttribute('src', '#');
        thumbFigDel.setAttribute('class', 'dd-list__del js-dd__btn-del');

        if (conf.thumbnail) {
            thumbFigImg = makeThumbnail(dataItem);
            thumbFig.appendChild(thumbFigImg);
        }

        thumbFig.appendChild(thumbFigCapt);
        thumbFig.appendChild(thumbFigDel);
        if (conf.validation.fileLimit > 1) {thumbCont.appendChild(reorderBtn);}
        thumbCont.appendChild(thumbFig);
        thumbWrap.appendChild(thumbCont);

        listItem.appendChild(thumbWrap);

        //LIST ITEM COMPONENT: FIELDS
        if (conf.title || conf.caption) {
            fields = document.createElement('div');
            fields.setAttribute('class', 'small-7 columns');

            //LIST ITEM COMPONENT: TITLE FIELD
            if (conf.title) {
                titleHash = createUniqueHash(generateHash, 7, usedHashes);
                usedHashes.push(titleHash);

                titleLabel1 = document.createElement('label');
                titleLabel1.setAttribute('for', 'image-title-' + titleHash);
                titleLabel1.setAttribute('class', 'label--primary');
                titleLabel1.textContent = 'Title';

                titleInput = document.createElement('input');
                titleInput.setAttribute('type', 'text');
                titleInput.setAttribute('class', 'input--basic js-dd__title-inpt js-cc__field');
                titleInput.setAttribute('id', 'image-title-' + titleHash);
                titleInput.setAttribute('data-parsley-group', 'block-images-content');
                titleInput.setAttribute('data-char-lim', '60');
                titleInput.required = true;

                titleLabel2 = document.createElement('label');
                titleLabel2.setAttribute('class', 'dd-list__label--sec label--secondary');
                titleLabel2.setAttribute('for', 'image-title-' + titleHash);
                titleLabel2.textContent = 'Suggested limit 60 characters';

                titleLabel3Span = document.createElement('span');
                titleLabel3Span.setAttribute('class', 'js-cc--under js-cc__count');
                titleLabel3Span.textContent = 60;

                titleLabel3 = document.createElement('label');
                titleLabel3.setAttribute('class', 'dd-list__label--sec label--tertiary');
                titleLabel3.setAttribute('for', 'image-title-' + titleHash);
                titleLabel3.appendChild(titleLabel3Span);
                titleLabel3.appendChild(document.createTextNode(' characters left'));

                titleFieldSet = document.createElement('fieldset');
                titleFieldSet.appendChild(titleLabel1);
                titleFieldSet.appendChild(titleInput);
                titleFieldSet.appendChild(titleLabel2);
                titleFieldSet.appendChild(titleLabel3);

                titleWrap = document.createElement('div');
                titleWrap.setAttribute('class', 'dd-set js-cc__set');
                titleWrap.appendChild(titleFieldSet);

                fields.appendChild(titleWrap);
            }

            //LIST ITEM COMPONENT: CAPTION FIELD
            if (conf.caption) {
                captionHash = createUniqueHash(generateHash, 7, usedHashes);
                usedHashes.push(captionHash);

                captionLabel1 = document.createElement('label');
                captionLabel1.setAttribute('for', 'image-caption-' + captionHash);
                captionLabel1.setAttribute('class', 'label--primary');
                captionLabel1.textContent = 'Caption';

                captionField = document.createElement('textarea');
                captionField.setAttribute('id', 'image-caption-' + captionHash);
                captionField.setAttribute('class', 'dd__field-major js-dd__capt-inpt js-cc__field');
                captionField.setAttribute('data-parsley-group', 'block-images-content');
                captionField.setAttribute('data-char-lim', '300');
                captionField.required = true;

                captionLabel2 = document.createElement('label');
                captionLabel2.setAttribute('class', 'dd-list__label--sec label--secondary');
                captionLabel2.setAttribute('for', 'image-caption-' + captionHash);
                captionLabel2.textContent = 'Suggested limit 300 characters';

                captionLabel3Span = document.createElement('span');
                captionLabel3Span.setAttribute('class', 'js-cc--under js-cc__count');
                captionLabel3Span.textContent = 300;

                captionLabel3 = document.createElement('label');
                captionLabel3.setAttribute('class', 'dd-list__label--sec label--tertiary');
                captionLabel3.setAttribute('for', 'image-caption-' + captionHash);
                captionLabel3.appendChild(captionLabel3Span);
                captionLabel3.appendChild(document.createTextNode(' characters left'));

                captionFieldSet = document.createElement('fieldset');
                captionFieldSet.appendChild(captionLabel1);
                captionFieldSet.appendChild(captionField);
                captionFieldSet.appendChild(captionLabel2);
                captionFieldSet.appendChild(captionLabel3);

                captionWrap = document.createElement('div');
                captionWrap.setAttribute('class', 'js-cc__set');
                captionWrap.appendChild(captionFieldSet);

               fields.appendChild(captionWrap);
            }

            listItem.appendChild(fields);
        }

        return listItem;
    }





    //ERROR HANDLING

    function tooMany(conf, $errorElement) {
        $errorElement.html( $(document.createElement('p')).text(conf.errMessages.num) );
    }

    function tooBig(conf, $errorElement, data) {
        $errorElement.html( $(document.createElement('p')).text(conf.errMessages.size + data.name) );
    }

    function wrongType(conf, $errorElement, data){
        $errorElement.html( $(document.createElement('p')).text(conf.errMessages.type + data.type) );
    }

    function subSuccess(e, conf, res){
        //redirect to url provided in the response body
        window.location = res.redirectUrl;
    };

    function subFail(e, conf, res){
        var errMessage = document.createElement('p');
        errMessage.textContent = conf.errMessages.sub;
        $(e.target).find(conf.subErrElement).append(errMessage);
    };

    function clearErrors(conf, $errorElement){
        $errorElement.html('');
    };



    //EVENT HANDLING

    function onDragEnter(e, conf){
        e.preventDefault();
        return false;
    }

    function onDragLeave(e, conf){
        e.preventDefault();
        return false;
    }
    function onDragOver(e, conf){
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'all';
        return false;
    }

    function onDragDrop(e, conf){
        e.preventDefault();
        var $thisInstance   = $(e.target).closest(conf.instance),
            instanceId      = $thisInstance.attr(conf.instanceIdAttr)

        uploadData(e, conf, instanceId, e.originalEvent.dataTransfer.files);

        return false;
    }

    function onSub(e, conf){
        e.preventDefault();

        subData(e, conf, prepareSubData(e, conf), (e.target).getAttribute('action') );

        $(e.target).off('submit.dD');
        return;
    }

    function onUpload(e, conf){
        e.preventDefault();
        var $thisInstance   = $(e.target).closest(conf.instance),
            instanceId      = $thisInstance.attr(conf.instanceIdAttr)

        uploadData(e, conf, instanceId, e.target.files);

        return false;
    }

    function onDelete(e, conf){
        var instanceId, itemId, $this, $thisInstance, $thisList, thisIndex, $theseItems;
        e.preventDefault();

        $this           = $(e.target);
        $thisInstance   = $this.closest(conf.instance);
        $thisList       = $this.closest(conf.list);
        thisIndex       = $thisList.find(conf.deleteButton).index(e.target);
        instanceId      = $thisInstance.attr(conf.instanceIdAttr);
        itemId          = $this.closest(conf.listItem).attr(conf.itemIdAttr);

        if(Object.keys(dataStored).length) {
            dataStored[instanceId] = deleteData(dataStored[instanceId], itemId);
        }

        $thisList.find(conf.listItem).eq(thisIndex).remove();
        clearErrors(conf, $thisInstance.find(conf.errorElement));
    }

    function onTitleChange(e, conf){storeFieldData(e, conf, 'title');}

    function onCaptionChange(e, conf){storeFieldData(e, conf, 'caption');}





    //MODULE DEFINITIONS

    function DD(){
        //MODULE GLOBALS
        var thisConf, thisSel;

        //MODULE METHODS
        function bindEvents() {
            thisSel.dropForm.on('submit.dD', function(e){
                if( $('#ipr-acceptance').length && !$('#ipr-acceptance').is(':checked') ) {return;}
                onSub.call(this, e, thisConf);
            });

            thisSel.fileInput.on('change.dD', function(e){onUpload.call(this, e, thisConf);});


            thisSel.dropInput.on('dragenter.dD', function(e){onDragEnter.call(this, e, thisConf);});
            thisSel.dropInput.on('dragenter.dD', function(e){onDragLeave.call(this, e, thisConf);});
            thisSel.dropInput.on('dragover.dD', function(e){onDragOver.call(this, e, thisConf);});
            thisSel.dropInput.on('drop.dD', function(e){onDragDrop.call(this, e, thisConf);});
            thisSel.dropInput.on('dragdrop.dD', function(e){onDragDrop.call(this, e, thisConf);});

            thisSel.dropList.on('click.dDDelete', thisConf.deleteButton, function(e){onDelete.call(this, e, thisConf);});
            thisSel.dropList.on('keyup.dDTitle', thisConf.titleInput, function(e){onTitleChange.call(this, e, thisConf);});
            thisSel.dropList.on('keyup.dDCaption', thisConf.captionInput, function(e){onCaptionChange.call(this, e, thisConf);});
        };

        this.init = function(options){
            //instantiate configuration and initial selections objects
            thisConf    = this.config   = ( options && isObj(options) ) ? new Config(options) : new Config();
            thisSel     = this.sel      = new InitSelections(this.config);
            //assign a unique id to each DOM instance of this module instance
            //store that unique id on the element node
            //create an entry in the app global storage for each DOM instance
            //files uploaded through DOM instance will be stored in app global storage under corresponding key
            thisSel.instance.each(function(){
                var thisId,
                    thisInstance = [];

                //store instance data
                thisId = assignInstanceId.call(this, thisConf);

                thisInstance.push(this);
                thisInstance.push(thisConf);

                ddInstances.push(thisInstance);
            });

            //bind events
            bindEvents();

            return this;
        };
    }





    //APP INITIALIZATION

    app.init = function() {

        if ($('#event-submission').length){
            //EVENT FORM

            //Event: flyer
            var eventFlyer = new DD().init({
                instance: '.js-dd__event-flyer',
                namespace: 'eventflyer',
                title: false,
                caption: false,
                thumbnail: false,
                validation: {
                    acceptTypes: ['application/pdf', 'application/x-pdf'],
                    fileLimit: 1,
                    fileSize: 15000000
                }
            });

            //Event: related images
            var eventImages =  new DD().init({
                instance: '.js-dd__event-img',
                namespace: 'eventimg',
                title: false,
                caption: false
            });

        } else if ($('#work-submission').length) {

            //GALLERY FORM

            //work type: audio
            var workAud     = new DD().init({
                instance: '.js-dd__aud',
                namespace: 'workaud',
                title: false,
                caption: false,
                thumbnail: false,
                validation: {
                    acceptTypes: ['audio/aiff', 'audio/x-aiff',
                                'audio/flac',
                                'audio/alac',
                                'audio/ogg', 'application/ogg',
                                'audio/wav','audio/x-wav', 'audio/wave', 'audio/x-pn-wav',
                                'audio/mpeg','audio/x-mpeg','audio/mpeg3','audio/x-mpeg-3','audio/mpeg',
                                'audio/x-aac',
                                'audio/AMR',
                                'audio/x-ms-wma'],
                    fileLimit: 1,
                    fileSize: 15000000
                }
            });

            //work type: audio, associated image
            var workAudImg  = new DD().init({
                instance: '.js-dd__aud-img',
                namespace: 'workaudimg',
                title: false,
                caption: false,
                thumbnail: false,
                validation: {
                    fileLimit: 1
                }
            });

            //work type: audio, associated image
            var workVidImg  = new DD().init({
                instance: '.js-dd__vid-img',
                namespace: 'vidimg',
                title: false,
                caption: false,
                thumbnail: false,
                validation: {
                    fileLimit: 1
                }
            });

            //work type: image
            var workImg     = new DD().init({
                instance: '.js-dd__img',
                namespace: 'workimg'
            });

            //work type: written
            var workWritten = new DD().init({
                instance: '.js-dd__writ',
                namespace: 'workwrit',
                title: false,
                caption: false,
                thumbnail: false,
                validation: {
                    acceptTypes: ['application/pdf', 'application/x-pdf'],
                    fileLimit: 1,
                    fileSize: 15000000
                }
            });

        } else if ($('#bio-submission').length) {

            //bio image
            var bioImg  = new DD().init({
                instance: '.js-dd__bio-img',
                namespace: 'bioimg',
                title: false,
                caption: false,
                thumbnail: false,
                validation: {
                    fileLimit: 1
                }
            });

        }
    };


    $(document).on('ready.DragAndDrop', function(){
        //Use Modernizr to check for dependency support
        if ( $('.filereader').length && $('.draganddrop').length ) {
            app.init();
        } else {
            if ( $('#workimgfallback').length ){
                $.ajax({
                    success: function(res){
                        $('#workimgfallback').append(res);
                        TISCH.revealOne.hideAllButFirst( $('#workimgfallback') );
                    },
                    error: function(res){return},
                    url: '/fallback-img-upload.html',
                    type: 'GET'
                });
            }
        }

    });


    return app;

}(jQuery, window.DragAndDrop = window.DragAndDrop || {} ));
