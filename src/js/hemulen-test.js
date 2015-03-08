//INSTANCES
var ddFull, ddFullEl, ddThumb, ddThumbEl, ddSingle, ddSingleEl;

//INSTANCE ONE
ddFull = new Hemulen({
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

ddFullEl = document.getElementById('ddfull0');
ddFullEl.addEventListener('hemulen-filestored', function(e){console.log('hemulen-filestored', e);}, false); 
ddFullEl.addEventListener('hemulen-toomany', function(e){console.log('hemulen-toomany', e);}, false);
ddFullEl.addEventListener('hemulen-toobig', function(e){console.log('hemulen-toobig', e);}, false);  
ddFullEl.addEventListener('hemulen-wrongtype', function(e){console.log('hemulen-wrongtype', e);}, false);


//INSTANCE TWO
ddThumb = new Hemulen({
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

ddThumbEl = document.getElementById('ddthumb0');
ddThumbEl.addEventListener('hemulen-filestored', function(e){console.log('hemulen-filestored', e);}, false);
ddThumbEl.addEventListener('hemulen-toomany', function(e){console.log('hemulen-toomany', e);}, false);
ddThumbEl.addEventListener('hemulen-toobig', function(e){console.log('hemulen-toobig', e);}, false);  
ddThumbEl.addEventListener('hemulen-wrongtype', function(e){console.log('hemulen-wrongtype', e);}, false);


//INSTANCE THREE
ddSingle = new Hemulen({
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

ddSingleEl = document.getElementById('ddsingle0');
ddSingleEl.addEventListener('hemulen-filestored', function(e){console.log('hemulen-filestored', e);}, false);
ddSingleEl.addEventListener('hemulen-toomany', function(e){console.log('hemulen-toomany', e);}, false);
ddSingleEl.addEventListener('hemulen-toobig', function(e){console.log('hemulen-toobig', e);}, false);  
ddSingleEl.addEventListener('hemulen-wrongtype', function(e){console.log('hemulen-wrongtype', e);}, false);