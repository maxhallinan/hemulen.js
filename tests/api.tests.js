;(function(){
    'use strict';

    var expect = chai.expect;

    var fooEl   = document.getElementById('foo');
    var fooForm = document.getElementById('fooform');
    var foo, fooElId;
    
    var fileId, fileStoredEvent, fileDeletedEvent;
    var testFile;

    var testDataUri = 'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QMtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUNDN0IwRjlENDExMTFFNEFEOTJCODUzRjQyREI5NkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUNDN0IwRkFENDExMTFFNEFEOTJCODUzRjQyREI5NkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQ0M3QjBGN0Q0MTExMUU0QUQ5MkI4NTNGNDJEQjk2RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0M3QjBGOEQ0MTExMUU0QUQ5MkI4NTNGNDJEQjk2RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEABALCwsMCxAMDBAXDw0PFxsUEBAUGx8XFxcXFx8eFxoaGhoXHh4jJSclIx4vLzMzLy9AQEBAQEBAQEBAQEBAQEABEQ8PERMRFRISFRQRFBEUGhQWFhQaJhoaHBoaJjAjHh4eHiMwKy4nJycuKzU1MDA1NUBAP0BAQEBAQEBAQEBAQP/AABEIAAEAAQMBIgACEQEDEQH/xABLAAEBAAAAAAAAAAAAAAAAAAAABwEBAAAAAAAAAAAAAAAAAAAAABABAAAAAAAAAAAAAAAAAAAAABEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AoAAP/9k=';

    var testData = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz'
    }

    function _handleFileStored(e, callback){
        fileStoredEvent = e;
        fileId          = e.fileId; 
        fooEl.removeEventListener('hemulen-filestored', _handleFileStored);
        callback();
    }

    function _handleFileDeleted(e, callback){
        fileDeletedEvent = e;
        fooEl.removeEventListener('hemulen-filedeleted', _handleFileDeleted);
        callback();
    }

    describe('Hemulen API', function(){
        before(function(){
            //create a fresh Hemulen instance to be used for testing
            foo = new Hemulen({
                dropInput: '.foo__drop-field',
                hemulenEl: '.foo',
                namespace: 'foo'
            });

            var builder = new WebKitBlobBuilder();
            builder.append(testDataUri);
            testFile = builder.getBlob('image/jpeg');
        });

        //TEST SUITES
        describe('Hemulen.prototype.getHemulenElId', function(){
            before(function(){
                fooElId = foo.getHemulenElId(fooEl);                
            });

            it('returns a string', function(){
                expect(fooElId).to.be.a('string');
            });

            it('returns a string with seven characters', function(){
                expect(fooElId).to.have.length(7);
            });

            it('throws an error if called without an element node as the first argument', function(){
                expect(function(){
                    foo.getHemulenElId(0);
                }).to.throw(/The first argument must be an element node/);
            });
        });

        describe('Hemulen.prototype.storeFiles', function(){
            before(function(done){
                fooEl.addEventListener('hemulen-filestored', function(e){_handleFileStored(e, done);}, false);
                foo.storeFiles(fooElId, [testFile]);                
            });

            it('triggers the hemulen-filestored event', function(){
                expect(fileStoredEvent.type).to.equal('hemulen-filestored');
            });
        
            it('stores the file at the expected location on the data model', function(){
                var formStorage = foo._getStorage(fooForm);
                var storedFile  = formStorage.filesStored[foo.namespace][fooElId][fileId].file;
                expect(storedFile).to.deep.equal(testFile);
            });
        });

        describe('Hemulen.prototype.addData', function(){
            before(function(){
                foo.addData(fooElId, fileId, testData);
            });

            it('the expected values are found in the expected location on the data model', function(){
                var formStorage     = foo._getStorage(fooForm);
                var storedDataFoo   = formStorage.filesStored[foo.namespace][fooElId][fileId].foo;
                var storedDataBar   = formStorage.filesStored[foo.namespace][fooElId][fileId].bar;
                var storedDataBaz   = formStorage.filesStored[foo.namespace][fooElId][fileId].baz;

                expect(storedDataFoo).to.equal(testData.foo);
                expect(storedDataBar).to.equal(testData.bar);
                expect(storedDataBaz).to.equal(testData.baz);
            });
        });

        describe('Hemulen.prototype.deleteFile', function(){
            before(function(done){
                fooEl.addEventListener('hemulen-filedeleted', function(e){_handleFileDeleted(e, done)}, false);
                foo.deleteFile(fooElId, fileStoredEvent.fileId);
            });

            it('triggers the hemulen-filedeleted event', function(){
                expect(fileDeletedEvent.type).to.equal('hemulen-filedeleted');
            });

            it('it removes the file from the expected location on the data model', function(){
                var formStorage = foo._getStorage(fooForm);
                var storedFile  = formStorage.filesStored[foo.namespace][fooElId][fileId];
                expect(storedFile).to.equal(undefined);
            });
        });
    
        describe('Hemulen.prototype.destroy', function(){
            before(function(){
                foo.destroy(fooElId);
            });

            it('deletes the Hemulen storage for the destroyed element', function(){
                var formStorage = foo._getStorage(fooForm);
                var fooStorage  = formStorage.filesStored[foo.namespace];
                console.log('api destroyed test');
                expect(fooStorage).to.equal(undefined);
            });

            it('removes the Hemulen event bindings on the destroyed element', function(){

            });
        });
    });
}());