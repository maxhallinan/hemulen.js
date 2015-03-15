;(function($){
    'use strict';

    //APP GLOBALS
    var full, thumb, single;

    var conf = {
        attrInstanceId: 'data-dd-instanceid',
        attrFileId: 'data-dd-fileid',
        instance: '.js-dd-instance',
        instanceSel: {
            full: 'js-dd--full',
            thumb: 'js-dd--thumb',
            single: 'js-dd--single',
        },
        list: '.js-dd__list',
        listItem: '.js-dd__list-item',
        del: '.js-dd__btn--del',
        reorder: '.js-dd__btn--reorder',
        listInpt: '.js-dd__list-inpt',
        inptTitle: 'js-dd__inpt--title',
        inptCapt: 'js-dd__inpt--capt',
        sortable: '.js-sortable',
        sortableHandle: '.js-sortable__handle',
        error: '.js-dd__err',
        subError: '.js-dd__err--sub',
        err: {
            tooMany: 'The number of files you are attempting to upload exceeds the file limit.',
            tooBig: 'This file exceeds the file size limit: ',
            wrongType: 'This file is the wrong file type: '
        },
        sub: {
            fail: 'There was a problem with the submission. Please try again.'
        }
    };


    //DOM SELECTIONS

    var form          = document.getElementById('ddform'),
        fullEl0       = document.getElementById('ddfull0'),
        fullEl1       = document.getElementById('ddfull1'),
        thumbEl0      = document.getElementById('ddthumb0'),
        thumbEl1      = document.getElementById('ddthumb1'),
        singleEl0     = document.getElementById('ddsingle0'),
        singleEl1     = document.getElementById('ddsingle1');


    //HANDLEBARS.JS TEMPLATES

    var fullTemplate    = Handlebars.compile( document.getElementById('ddlistfulltemp').innerHTML ),
        thumbTemplate   = Handlebars.compile( document.getElementById('ddlistthumbtemp').innerHTML ),
        singleTemplate  = Handlebars.compile( document.getElementById('ddlistsingletemp').innerHTML );





    //HEMULEN.JS INSTANTIATIONS

    //Instance 1
    full = new Hemulen({
        hemulen: '.js-dd--full',
        namespace: 'ddfull',
        dropInput: '.js-dd__field',
        fileInput: '.js-dd__file-inpt',
        acceptTypes: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/bmp'],
        fileMaxSize: 5000000,
        fileLimit: 5,
        beforeSub: function(e){console.log('beforeSub full');}
    });

    $('.js-dd--full').each(function(){
        var instanceId = full.getInstanceId(this);
        $(this).attr('data-dd-instanceid', instanceId);
    });


    //Instance 2
    thumb = new Hemulen({
        hemulen: '.js-dd--thumb',
        namespace: 'ddthumb',
        dropInput: '.js-dd__field',
        fileInput: '.js-dd__file-inpt',
        acceptTypes: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/bmp'],
        fileMaxSize: 5000000,
        fileLimit: 10,
        beforeSub: function(e){console.log('beforeSub thumb');}
    });

    $('.js-dd--thumb').each(function(){
        var instanceId = thumb.getInstanceId(this);
        $(this).attr('data-dd-instanceid', instanceId);
    });


    //Instance 3
    single = new Hemulen({
        hemulen: '.js-dd--single',
        namespace: 'ddsingle',
        dropInput: '.js-dd__field',
        fileInput: '.js-dd__file-inpt',
        acceptTypes: ['application/pdf'],
        fileMaxSize: 5000000,
        fileLimit: 1,
        beforeSub: function(e){console.log('beforeSub single');}
    });

    $('.js-dd--single').each(function(){
        var instanceId = single.getInstanceId(this);
        $(this).attr('data-dd-instanceid', instanceId);
    });


    //EVENT HANDLERS

    //General events

    function _onFileStoredFull(e){
        var reader          = new FileReader();

        reader.onload = function(readerE){
            var $sortableList = $(conf.sortable);

            $(e.detail.instance).find(conf.list).append(fullTemplate({
                name: e.detail.file.name,
                fileId: e.detail.fileId,
                thumbSrc: readerE.target.result
            }));

            //DESTROY AND RE-INITIALIZE REORDER PLUGIN
            $sortableList.sortable('destroy');

            $sortableList.sortable({
                forcePlaceholderSize: true,
                handle: conf.sortableHandle
            });
        };

        reader.readAsDataURL(e.detail.file);

        console.log('hemulen-filestored', e);
    }

    function _onFileStoredThumb(e){
        var reader = new FileReader();

        reader.onload = function(readerE){
            var $sortableList = $(conf.sortable);

            $(e.detail.instance).find(conf.list).append(thumbTemplate({
                name: e.detail.file.name,
                fileId: e.detail.fileId,
                thumbSrc: readerE.target.result
            }));

            //DESTROY AND RE-INITIALIZE REORDER PLUGIN
            $sortableList.sortable('destroy');

            $sortableList.sortable({
                forcePlaceholderSize: true,
                handle: conf.sortableHandle
            });

        };

        reader.readAsDataURL(e.detail.file);

        console.log('hemulen-filestored', e);
    }

    function _onFileStoredSingle(e){    
        $(e.detail.instance).find(conf.list).html(singleTemplate({
            name: e.detail.file.name,
            fileId: e.detail.fileId
        }));

        console.log('hemulen-filestored', e);
    }

    function _onDelete(e){
        e.preventDefault();

        var $this           = $(this), 
            $thisItem       = $this.closest(conf.listItem),
            $thisInstance   = $this.closest(conf.instance),
            instanceId      = $thisInstance.attr(conf.attrInstanceId),
            fileId          = $(this).closest(conf.listItem).attr(conf.attrFileId);

        if ( $thisInstance.hasClass(conf.instanceSel.full) ) {
            full.deleteFile(instanceId, fileId);
        } else if ( $thisInstance.hasClass(conf.instanceSel.thumb) ) {
            thumb.deleteFile(instanceId, fileId);
        } else if ( $thisInstance.hasClass(conf.instanceSel.single) ) {
            single.deleteFile(instanceId, fileId);
        }

        $thisItem.remove();

        console.log('list delete', e);
    }

    function _onListInpt(e){
        var $this           = $(this), 
            $thisItem       = $this.closest(conf.listItem),
            $thisInstance   = $this.closest(conf.instance),
            instanceId      = $thisInstance.attr(conf.attrInstanceId),
            fileId          = $this.closest(conf.listItem).attr(conf.attrFileId),
            thisValue       = $this.val(),
            thisData = {};

        if ($this.hasClass(conf.inptTitle) ) {
            thisData.title = thisValue;
        } else if ($this.hasClass(conf.inptCapt)){
            thisData.caption = thisValue;
        }

        if ( $thisInstance.hasClass(conf.instanceSel.full) ) {
            full.addData(instanceId, fileId, thisData);
        } else if ( $thisInstance.hasClass(conf.instanceSel.thumb) ) {
            thumb.addData(instanceId, fileId, thisData);
        } else if ( $thisInstance.hasClass(conf.instanceSel.single) ) {
            single.addData(instanceId, fileId, thisData);
        }

        console.log('list keyup ', e);
    }

    //Error events

    function _onTooBig(e){
        var errMessage = document.createElement('p');
            errMessage.textContent = conf.err.tooBig + e.detail.file.name;

        $(e.detail.instance).find(conf.ddError).append(errMessage);

        console.log('hemulen-toomany', e);
    }
    
    function _onTooMany(e){
        var errMessage = document.createElement('p');
            errMessage.textContent = conf.err.tooMany;

        $(e.detail.instance).find(conf.ddError).append(errMessage);

        console.log('hemulen-toobig', e);
    }
    
    function _onWrongType(e){
        var errMessage = document.createElement('p');
            errMessage.textContent = conf.err.wrongType + e.detail.file.name;

        $(e.detail.instance).find(conf.ddError).append(errMessage);

        console.log('hemulen-wrongtype', e);
    }
    

    //Form submission events

    function _onSubSuccess(e){
        window.location = (JSON.parse(e.detail.request.response)).redirectUrl;

        console.log('hemulen-subsuccess', e);
    }
    
    function _onSubFailure(e){
        $(e.target).find(conf.ddSubError).text(conf.sub.fail);

        console.log('hemulen-subfailure', e);
    }





    //EVENT LISTENERS

    form.addEventListener('hemulen-subsuccess', _onSubSuccess, false);
    form.addEventListener('hemulen-subfailure', _onSubFailure, false);


    fullEl0.addEventListener('hemulen-filestored', _onFileStoredFull, false); 
    fullEl0.addEventListener('hemulen-toomany', _onTooMany, false);
    fullEl0.addEventListener('hemulen-toobig', _onTooBig, false);  
    fullEl0.addEventListener('hemulen-wrongtype', _onWrongType, false);
    fullEl0.addEventListener('hemulen-filedeleted', function(e){console.log('hemulen-filedeleted', e);}, false);


    fullEl1.addEventListener('hemulen-filestored', _onFileStoredFull, false); 
    fullEl1.addEventListener('hemulen-toomany', _onTooMany, false);
    fullEl1.addEventListener('hemulen-toobig', _onTooBig, false);  
    fullEl1.addEventListener('hemulen-wrongtype', _onWrongType, false);
    fullEl1.addEventListener('hemulen-filedeleted', function(e){console.log('hemulen-filedeleted', e);}, false);


    thumbEl0.addEventListener('hemulen-filestored', _onFileStoredThumb, false);
    thumbEl0.addEventListener('hemulen-toomany', _onTooMany, false);
    thumbEl0.addEventListener('hemulen-toobig', _onTooBig, false);  
    thumbEl0.addEventListener('hemulen-wrongtype', _onWrongType, false);
    thumbEl0.addEventListener('hemulen-filedeleted', function(e){console.log('hemulen-filedeleted', e);}, false);

    thumbEl1.addEventListener('hemulen-filestored', _onFileStoredThumb, false);
    thumbEl1.addEventListener('hemulen-toomany', _onTooMany, false);
    thumbEl1.addEventListener('hemulen-toobig', _onTooBig, false);  
    thumbEl1.addEventListener('hemulen-wrongtype', _onWrongType, false);
    thumbEl1.addEventListener('hemulen-filedeleted', function(e){console.log('hemulen-filedeleted', e);}, false);


    singleEl0.addEventListener('hemulen-filestored', _onFileStoredSingle, false);
    singleEl0.addEventListener('hemulen-toomany', _onTooMany, false);
    singleEl0.addEventListener('hemulen-toobig', _onTooBig, false);  
    singleEl0.addEventListener('hemulen-wrongtype', _onWrongType, false);
    singleEl0.addEventListener('hemulen-filedeleted', function(e){console.log('hemulen-filedeleted', e);}, false);

    singleEl1.addEventListener('hemulen-filestored', _onFileStoredSingle, false);
    singleEl1.addEventListener('hemulen-toomany', _onTooMany, false);
    singleEl1.addEventListener('hemulen-toobig', _onTooBig, false);  
    singleEl1.addEventListener('hemulen-wrongtype', _onWrongType, false);
    singleEl1.addEventListener('hemulen-filedeleted', function(e){console.log('hemulen-filedeleted', e);}, false);

    $(conf.list).on('click.delete', conf.del, _onDelete);
    $(conf.list).on('keyup.fileinfo', conf.listInpt, _onListInpt);

}(jQuery));









