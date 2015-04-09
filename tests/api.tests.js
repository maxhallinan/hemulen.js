;(function(){
    'use strict';

    var expect = chai.expect;

    var testFile;

    describe('Hemulen API', function(){
        before(function(done){
            var req = new XMLHttpRequest();
            req.responseType = 'arraybuffer';
            req.onreadystatechange = function(e){
                if (req.readyState === 4) {
                    testFile = new Blob([req.response], {type: 'image/jpeg'});
                    done();                    
                }
            };
            req.open('GET', '/tests/data/test.jpg', true);
            req.send();
        });

        describe('Hemulen.prototype.addData', function(){
            var fooForm = document.getElementById('fooform');
            var foo, fooEl, fooElId;
            var fileStoredEvent;

            before(function(done){
                function handleFileStored(e){
                    fileStoredEvent = e;                
                    fooEl.removeEventListener('hemulen-filestored', handleFileStored);
                    done();  
                }
                foo = new Hemulen({
                    dropInput: '.foo__drop-field',
                    hemulenEl: '.foo',
                    namespace: 'foo'
                });
                fooEl       = document.getElementById('foo');
                fooElId     = foo.getHemulenElId(fooEl);
                fooEl.addEventListener('hemulen-filestored', handleFileStored, false); 
                foo.storeFiles(fooElId, [testFile]);  
            });

            it('triggers the hemulen-filestored event', function(){
                expect(fileStoredEvent.type).to.equal('hemulen-filestored');
            });
        
            it('stores the file at the expected location on the data model', function(){
                var formStorage = foo._getStorage(fooForm);
                expect(formStorage.filesStored[foo.namespace][fooElId][fileStoredEvent.fileId].file).to.deep.equal(testFile);
            });
        });

        describe('Hemulen.prototype.deleteFile', function(){});
        
        describe('Hemulen.prototype.getHemulenElId', function(){});
        
        describe('Hemulen.prototype.storeFiles', function(){});
    });
}());