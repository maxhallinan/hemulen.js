;(function($){
    'use strict';

    //APP GLOBALS

    var full, thumb, single;


    //CONFIGURATION

    var conf = {
        attrHemulenElId: 'data-dd-hemulenelid',
        attrFileId: 'data-dd-fileid',
        instance: '.js-dd-el',
        instanceSel: {
            full: 'js-dd--full',
            thumb: 'js-dd--thumb',
            single: 'js-dd--single',
        },
        list: '.js-dd__list',
        listItem: '.js-dd__list-item',
        listInpt: '.js-dd__list-inpt',
        inptTitle: 'js-dd__inpt--title',
        inptCapt: 'js-dd__inpt--capt',
        del: '.js-dd__btn--del',
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

    // var form          = document.getElementById('ddform');
    // var fullEl0       = document.getElementById('ddfull0');
    // var fullEl1       = document.getElementById('ddfull1');
    // var thumbEl0      = document.getElementById('ddthumb0');
    // var thumbEl1      = document.getElementById('ddthumb1');
    // var singleEl0     = document.getElementById('ddsingle0');
    // var singleEl1     = document.getElementById('ddsingle1');


    //HANDLEBARS.JS TEMPLATES

    // var fullTemplate    = Handlebars.compile( document.getElementById('ddlistfulltemp').innerHTML );
    // var thumbTemplate   = Handlebars.compile( document.getElementById('ddlistthumbtemp').innerHTML );
    // var singleTemplate  = Handlebars.compile( document.getElementById('ddlistsingletemp').innerHTML );



    // function setPositionValues(instance){
    //     var hemulenElId, fileId;

    //     $(instance.hemulenEl).each(function(){
    //         var $this = $(this);
    //         var hemulenElId = $this.attr(conf.attrHemulenElId);
    //         var $theseItems = $this.find(conf.listItem);

    //         $theseItems.each(function(){
    //             var $that           = $(this);
    //             var fileId          = $that.attr(conf.attrFileId);
    //             var positionVal     = $theseItems.index($that);

    //             instance.addData(hemulenElId, fileId, {position: positionVal});
    //         });
    //     });       
    // };


    //HEMULEN.JS INSTANTIATIONS

    //Instance 1
    full = new Hemulen({
        hemulenEl: '.js-dd--full',
        namespace: 'ddfull',
        dropInput: '.js-dd__field',
        fileInput: '.js-dd__file-inpt',
        acceptTypes: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/bmp'],
        fileMaxSize: 5000000,
        fileLimit: 5,
        beforeSub: function(e, instance){console.log('form submitting: ', e);}
    });

    $('.js-dd--full').each(function(){
        var hemulenElId = full.getHemulenElId(this);
        $(this).attr(conf.attrHemulenElId, hemulenElId);
    });

    // //Instance 2
    // thumb = new Hemulen({
    //     hemulenEl: '.js-dd--thumb',
    //     namespace: 'ddthumb',
    //     dropInput: '.js-dd__field',
    //     fileInput: '.js-dd__file-inpt',
    //     acceptTypes: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/bmp'],
    //     fileMaxSize: 5000000,
    //     fileLimit: 10,
    //     beforeSub: function(e, instance){setPositionValues(instance);}
    // });

    // $('.js-dd--thumb').each(function(){
    //     var hemulenElId = thumb.getHemulenElId(this);
    //     $(this).attr(conf.attrHemulenElId, hemulenElId);
    // });


    // //Instance 3
    // single = new Hemulen({
    //     hemulenEl: '.js-dd--single',
    //     namespace: 'ddsingle',
    //     dropInput: '.js-dd__field',
    //     fileInput: '.js-dd__file-inpt',
    //     acceptTypes: ['application/pdf'],
    //     fileMaxSize: 5000000,
    //     fileLimit: 1,
    //     beforeSub: function(e, instance){console.log('beforeSub single', e, instance);}
    // });

    // $('.js-dd--single').each(function(){
    //     var hemulenElId = single.getHemulenElId(this);
    //     $(this).attr(conf.attrHemulenElId, hemulenElId);
    // });


    //EVENT HANDLERS

    //General events

    // function _onFileStoredFull(e){
    //     var reader          = new FileReader();

    //     reader.onload = function(readerE){
    //         var $sortableList = $(conf.sortable);
    //         var $eTarg        = $(e.target);

    //         $eTarg.find(conf.error).html('');

    //         $eTarg.find(conf.list).append(fullTemplate({
    //             name: e.detail.file.name,
    //             fileId: e.detail.fileId,
    //             thumbSrc: readerE.target.result
    //         }));

    //         //DESTROY AND RE-INITIALIZE REORDER PLUGIN
    //         $sortableList.sortable('destroy');

    //         $sortableList.sortable({
    //             forcePlaceholderSize: true,
    //             handle: conf.sortableHandle
    //         });
    //     };

    //     reader.readAsDataURL(e.detail.file);
    // }

    // function _onFileStoredThumb(e){
    //     var reader = new FileReader();
    //     var $eTarg        = $(e.target);

    //     $eTarg.find(conf.error).html('');

    //     reader.onload = function(readerE){
    //         var $sortableList = $(conf.sortable);

    //         $eTarg.find(conf.list).append(thumbTemplate({
    //             name: e.detail.file.name,
    //             fileId: e.detail.fileId,
    //             thumbSrc: readerE.target.result
    //         }));

    //         //DESTROY AND RE-INITIALIZE REORDER PLUGIN
    //         $sortableList.sortable('destroy');

    //         $sortableList.sortable({
    //             forcePlaceholderSize: true,
    //             handle: conf.sortableHandle
    //         });

    //     };

    //     reader.readAsDataURL(e.detail.file);
    // }

    // function _onFileStoredSingle(e){    
    //     $eTarg.find(conf.list).html(singleTemplate({
    //         name: e.detail.file.name,
    //         fileId: e.detail.fileId
    //     }));
    // }

    // function _onDeleteFile(e){
    //     e.preventDefault();

    //     var $this           = $(this); 
    //     var $thisInstance   = $this.closest(conf.instance);
    //     var hemulenElId     = $thisInstance.attr(conf.attrHemulenElId);
    //     var fileId          = $(this).closest(conf.listItem).attr(conf.attrFileId);

    //     if ( $thisInstance.hasClass(conf.instanceSel.full) ) {
    //         full.deleteFile(hemulenElId, fileId);
    //     } else if ( $thisInstance.hasClass(conf.instanceSel.thumb) ) {
    //         thumb.deleteFile(hemulenElId, fileId);
    //     } else if ( $thisInstance.hasClass(conf.instanceSel.single) ) {
    //         single.deleteFile(hemulenElId, fileId);
    //     }


    // }

    // function _onFileDeleted(e){
    //     var $this           = $(this); 
    //     var $thisItem       = $this.find("[" + conf.attrFileId + "=" + e.detail.fileId + "]");

    //     $thisItem.remove();
    // }

    // function _onListInpt(e){
    //     var $this           = $(this), 
    //         $thisItem       = $this.closest(conf.listItem),
    //         $thisInstance   = $this.closest(conf.instance),
    //         hemulenElId      = $thisInstance.attr(conf.attrHemulenElId),
    //         fileId          = $this.closest(conf.listItem).attr(conf.attrFileId),
    //         thisValue       = $this.val(),
    //         thisData = {};

    //     if ($this.hasClass(conf.inptTitle) ) {
    //         thisData.title = thisValue;
    //     } else if ($this.hasClass(conf.inptCapt)){
    //         thisData.caption = thisValue;
    //     }

    //     if ( $thisInstance.hasClass(conf.instanceSel.full) ) {
    //         full.addData(hemulenElId, fileId, thisData);
    //     } else if ( $thisInstance.hasClass(conf.instanceSel.thumb) ) {
    //         thumb.addData(hemulenElId, fileId, thisData);
    //     } else if ( $thisInstance.hasClass(conf.instanceSel.single) ) {
    //         single.addData(hemulenElId, fileId, thisData);
    //     }
    // }


    // //Error events

    // function _onInvalid(e){
    //     var errMessage;
    //     var $errContainer = $(e.target).find(conf.error);
        
    //     $errContainer.html('');
    
    //     for (var i = 0, j = e.detail.errors.length; i < j; i++){
    //         errMessage = document.createElement('p');
    //         if (e.detail.errors[i].errorType === 'too big') {
    //             errMessage.textContent = conf.err.tooBig + e.detail.errors[i].file.name;
    //         } else if (e.detail.errors[i].errorType === 'wrong type') {
    //             errMessage.textContent = conf.err.wrongType + e.detail.errors[i].file.name;
    //         } 
    //         $errContainer.append(errMessage);
    //     }
    // }
    
    // function _onTooMany(e){
    //     var errMessage = document.createElement('p');
    //         errMessage.textContent = conf.err.tooMany;

    //     $(e.target).find(conf.error)
    //         .html('')
    //         .append(errMessage);
    // }
    

    // //Form submission events

    // function _onSubSuccess(e){
    //     window.location = (JSON.parse(e.detail.request.response)).redirectUrl;
    // }
    
    // function _onSubFailure(e){
    //     $(e.target).find(conf.ddSubError).text(conf.sub.fail);
    // }





    //EVENT LISTENERS

    // form.addEventListener('hemulen-subsuccess', _onSubSuccess, false);
    // form.addEventListener('hemulen-subfailure', _onSubFailure, false);


    // fullEl0.addEventListener('hemulen-filestored', _onFileStoredFull, false); 
    // fullEl0.addEventListener('hemulen-toomany', _onTooMany, false);
    // fullEl0.addEventListener('hemulen-invalid', _onInvalid, false);  
    // fullEl0.addEventListener('hemulen-filedeleted', _onFileDeleted, false);
    // fullEl0.addEventListener('hemulen-error', function(e){console.log('hemulen-error: ', e);}, false);

    // fullEl1.addEventListener('hemulen-filestored', _onFileStoredFull, false); 
    // fullEl1.addEventListener('hemulen-toomany', _onTooMany, false);
    // fullEl1.addEventListener('hemulen-invalid', _onInvalid, false);  
    // fullEl1.addEventListener('hemulen-filedeleted', _onFileDeleted, false);


    // thumbEl0.addEventListener('hemulen-filestored', _onFileStoredThumb, false);
    // thumbEl0.addEventListener('hemulen-toomany', _onTooMany, false);
    // thumbEl0.addEventListener('hemulen-invalid', _onInvalid, false);  
    // thumbEl0.addEventListener('hemulen-filedeleted', _onFileDeleted, false);

    // thumbEl1.addEventListener('hemulen-filestored', _onFileStoredThumb, false);
    // thumbEl1.addEventListener('hemulen-toomany', _onTooMany, false);
    // thumbEl1.addEventListener('hemulen-invalid', _onInvalid, false);  
    // thumbEl1.addEventListener('hemulen-filedeleted', _onFileDeleted, false);


    // singleEl0.addEventListener('hemulen-filestored', _onFileStoredSingle, false);
    // singleEl0.addEventListener('hemulen-toomany', _onTooMany, false);
    // singleEl0.addEventListener('hemulen-invalid', _onInvalid, false);  
    // singleEl0.addEventListener('hemulen-filedeleted', _onFileDeleted, false);

    // singleEl1.addEventListener('hemulen-filestored', _onFileStoredSingle, false);
    // singleEl1.addEventListener('hemulen-toomany', _onTooMany, false);
    // singleEl1.addEventListener('hemulen-invalid', _onInvalid, false);  
    // singleEl1.addEventListener('hemulen-filedeleted', _onFileDeleted, false);

    // $(conf.list).on('click.delete', conf.del, _onDeleteFile);
    // $(conf.list).on('keyup.fileinfo', conf.listInpt, _onListInpt);

}(jQuery));









