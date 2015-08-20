;(function(){
    'use strict';

    var expect = chai.expect;

    var fooEl   = document.getElementById('foo');
    var fooForm = document.getElementById('fooform');
    var foo, fooElId;

    var fileId, fileStoredEvent, fileDeletedEvent;
    var testFile;

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
                hemulenEl: '.foo',
                namespace: 'foo'
            });

            var builder = new WebKitBlobBuilder();
            builder.append(hemulenTestData.imageURI);
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
                foo.addData(fooElId, fileId, hemulenTestData.associatedValues);
            });

            it('the expected values are found in the expected location on the data model', function(){
                var formStorage     = foo._getStorage(fooForm);
                var storedDataFoo   = formStorage.filesStored[foo.namespace][fooElId][fileId].foo;
                var storedDataBar   = formStorage.filesStored[foo.namespace][fooElId][fileId].bar;
                var storedDataBaz   = formStorage.filesStored[foo.namespace][fooElId][fileId].baz;

                expect(storedDataFoo).to.equal(hemulenTestData.associatedValues.foo);
                expect(storedDataBar).to.equal(hemulenTestData.associatedValues.bar);
                expect(storedDataBaz).to.equal(hemulenTestData.associatedValues.baz);
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

                expect(fooStorage).to.equal(undefined);
            });

            it('removes the Hemulen event bindings on the destroyed element', function(){

            });
        });
    });
}());
