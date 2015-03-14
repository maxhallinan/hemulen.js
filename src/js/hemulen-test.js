var ddFull, ddFullEl, ddThumb, ddThumbEl, ddSingle, ddSingleEl;

//DD FORM
ddForm = document.getElementById('ddform');
ddForm.addEventListener('hemulen-subsuccess', function(e){console.log('hemulen-subsuccess', e);}, false);
ddForm.addEventListener('hemulen-subfailure', function(e){console.log('hemulen-subfailure', e);}, false);

//INSTANCES

//INSTANCE ONE
ddFull = new Hemulen({
    hemulen: '.js-dd--full',
    namespace: 'ddfull',
    dropInput: '.js-dd__field',
    fileInput: '.js-dd__file-inpt',
    acceptTypes: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/bmp'],
    fileMaxSize: 5000000,
    fileLimit: 10
});


ddFullEl0 = document.getElementById('ddfull0');
ddFullEl1 = document.getElementById('ddfull1');

ddFullEl0.addEventListener('hemulen-filestored', function(e){console.log('hemulen-filestored', e);}, false); 
ddFullEl0.addEventListener('hemulen-toomany', function(e){console.log('hemulen-toomany', e);}, false);
ddFullEl0.addEventListener('hemulen-toobig', function(e){console.log('hemulen-toobig', e);}, false);  
ddFullEl0.addEventListener('hemulen-wrongtype', function(e){console.log('hemulen-wrongtype', e);}, false);

ddFullEl1.addEventListener('hemulen-filestored', function(e){console.log('hemulen-filestored', e);}, false); 
ddFullEl1.addEventListener('hemulen-toomany', function(e){console.log('hemulen-toomany', e);}, false);
ddFullEl1.addEventListener('hemulen-toobig', function(e){console.log('hemulen-toobig', e);}, false);  
ddFullEl1.addEventListener('hemulen-wrongtype', function(e){console.log('hemulen-wrongtype', e);}, false);

//INSTANCE TWO
ddThumb = new Hemulen({
    hemulen: '.js-dd--thumb',
    namespace: 'ddthumb',
    dropInput: '.js-dd__field',
    fileInput: '.js-dd__file-inpt',
    acceptTypes: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/bmp'],
    fileMaxSize: 5000000,
    fileLimit: 5
});

ddThumbEl0 = document.getElementById('ddthumb0');
ddThumbEl1 = document.getElementById('ddthumb1');

ddThumbEl0.addEventListener('hemulen-filestored', function(e){console.log('hemulen-filestored', e);}, false);
ddThumbEl0.addEventListener('hemulen-toomany', function(e){console.log('hemulen-toomany', e);}, false);
ddThumbEl0.addEventListener('hemulen-toobig', function(e){console.log('hemulen-toobig', e);}, false);  
ddThumbEl0.addEventListener('hemulen-wrongtype', function(e){console.log('hemulen-wrongtype', e);}, false);

ddThumbEl1.addEventListener('hemulen-filestored', function(e){console.log('hemulen-filestored', e);}, false);
ddThumbEl1.addEventListener('hemulen-toomany', function(e){console.log('hemulen-toomany', e);}, false);
ddThumbEl1.addEventListener('hemulen-toobig', function(e){console.log('hemulen-toobig', e);}, false);  
ddThumbEl1.addEventListener('hemulen-wrongtype', function(e){console.log('hemulen-wrongtype', e);}, false);


//INSTANCE THREE
ddSingle = new Hemulen({
    hemulen: '.js-dd--single',
    namespace: 'ddsingle',
    dropInput: '.js-dd__field',
    fileInput: '.js-dd__file-inpt',
    acceptTypes: ['application/pdf'],
    fileMaxSize: 5000000,
    fileLimit: 1
});

ddSingleEl0 = document.getElementById('ddsingle0');
ddSingleEl1 = document.getElementById('ddsingle1');

ddSingleEl0.addEventListener('hemulen-filestored', function(e){console.log('hemulen-filestored', e);}, false);
ddSingleEl0.addEventListener('hemulen-toomany', function(e){console.log('hemulen-toomany', e);}, false);
ddSingleEl0.addEventListener('hemulen-toobig', function(e){console.log('hemulen-toobig', e);}, false);  
ddSingleEl0.addEventListener('hemulen-wrongtype', function(e){console.log('hemulen-wrongtype', e);}, false);

ddSingleEl1.addEventListener('hemulen-filestored', function(e){console.log('hemulen-filestored', e);}, false);
ddSingleEl1.addEventListener('hemulen-toomany', function(e){console.log('hemulen-toomany', e);}, false);
ddSingleEl1.addEventListener('hemulen-toobig', function(e){console.log('hemulen-toobig', e);}, false);  
ddSingleEl1.addEventListener('hemulen-wrongtype', function(e){console.log('hemulen-wrongtype', e);}, false);