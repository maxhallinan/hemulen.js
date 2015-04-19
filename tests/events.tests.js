;(function(){
    'use strict';

    var expect = chai.expect;

    var fooEl = document.getElementById('foo');
    var foo, fooElId;

    var testFileValid, testFileWrongType, testFileId;

    var testDataUri = 'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/4QMtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUNDN0IwRjlENDExMTFFNEFEOTJCODUzRjQyREI5NkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUNDN0IwRkFENDExMTFFNEFEOTJCODUzRjQyREI5NkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQ0M3QjBGN0Q0MTExMUU0QUQ5MkI4NTNGNDJEQjk2RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0M3QjBGOEQ0MTExMUU0QUQ5MkI4NTNGNDJEQjk2RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEABALCwsMCxAMDBAXDw0PFxsUEBAUGx8XFxcXFx8eFxoaGhoXHh4jJSclIx4vLzMzLy9AQEBAQEBAQEBAQEBAQEABEQ8PERMRFRISFRQRFBEUGhQWFhQaJhoaHBoaJjAjHh4eHiMwKy4nJycuKzU1MDA1NUBAP0BAQEBAQEBAQEBAQP/AABEIAAEAAQMBIgACEQEDEQH/xABLAAEBAAAAAAAAAAAAAAAAAAAABwEBAAAAAAAAAAAAAAAAAAAAABABAAAAAAAAAAAAAAAAAAAAABEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AoAAP/9k=';

    describe('Hemulen Events', function(){
        before(function(){
            var builder = new WebKitBlobBuilder();
            builder.append(testDataUri);
            testFileValid           = builder.getBlob('image/jpeg');
            testFileWrongType       = builder.getBlob('image/gif'); 
        });

        describe('hemulen-filestored', function(){
            var fileStoredEvent;

            before(function(done){
                foo = new Hemulen({
                    dropInput: '.foo__drop-field',
                    hemulenEl: '.foo',
                    namespace: 'foo',
                    acceptTypes: ['image/jpeg'],
                    fileMaxSize: 10000000,
                    fileLimit: 1
                });
                
                fooElId = foo.getHemulenElId(fooEl);

                function handleFileStored(e){
                    fileStoredEvent = e;
                    testFileId = e.fileId;                    
                    fooEl.removeEventListener('hemulen-filestored', handleFileStored);
                    done();  
                }
                fooEl.addEventListener('hemulen-filestored', handleFileStored, false); 
                foo.storeFiles(fooElId, [testFileValid]);               
            });

            after(function(){
                foo.destroy(fooElId);
            });

            it('storing a file dispatches the event', function(){
                expect(fileStoredEvent.type).to.equal('hemulen-filestored');
            });

            it('hemulen-filestored.hemulen has the expected value', function(){
                expect(fileStoredEvent.hemulen).to.deep.equal(foo);
            });

            it('hemulen-filestored.hemulenElId has the expected value', function(){
                expect(fileStoredEvent.hemulenElId).to.equal(fooElId);
            });

            it('hemulen-filestored.file has the expected value', function(){
                expect(fileStoredEvent.file).to.deep.equal(testFileValid);
            });

            it('hemulen-filestored.fileId has the expected value', function(){
                expect(fileStoredEvent.fileId).to.equal(testFileId);
            });
        });

        describe('hemulen-filedeleted', function(){
            var fileDeletedEvent;

            before(function(done){
                foo = new Hemulen({
                    dropInput: '.foo__drop-field',
                    hemulenEl: '.foo',
                    namespace: 'foo',
                    acceptTypes: ['image/jpeg'],
                    fileMaxSize: 10000000,
                    fileLimit: 1
                });
                
                fooElId = foo.getHemulenElId(fooEl);

                function handleFileDeleted(e){
                    fileDeletedEvent = e;
                    fooEl.removeEventListener('hemulen-filedeleted', handleFileDeleted);
                    done();                
                }                
                fooEl.addEventListener('hemulen-filedeleted', handleFileDeleted, false);
                foo.deleteFile(fooElId, testFileId);
            });

            after(function(){
                foo.destroy(fooElId);
            });

            it('deleting a file dispatches the event', function(){
                expect(fileDeletedEvent.type).to.equal('hemulen-filedeleted');
            });

            it('hemulen-filedeleted.hemulen has the expected value', function(){
                expect(fileDeletedEvent.hemulen).to.deep.equal(foo);
            });

            it('hemulen-filedeleted.hemulenElId has the expected value', function(){
                expect(fileDeletedEvent.hemulenElId).to.equal(fooElId);                
            });
        });
        
        describe('hemulen-toomany', function(){
            var testFiles = [testFileValid, testFileValid];
            var tooManyEvent;

            before(function(done){
                foo = new Hemulen({
                    dropInput: '.foo__drop-field',
                    hemulenEl: '.foo',
                    namespace: 'foo',
                    acceptTypes: ['image/jpeg'],
                    fileMaxSize: 10000000,
                    fileLimit: 1
                });
                
                fooElId = foo.getHemulenElId(fooEl);

                function handleTooMany(e){
                    tooManyEvent = e;
                    fooEl.removeEventListener('hemulen-toomany', handleTooMany);
                    done();                
                }
                fooEl.addEventListener('hemulen-toomany', handleTooMany, false);
                foo.storeFiles(fooElId, testFiles);
            });

            after(function(){
                foo.destroy(fooElId);
            });

            it('attempting to store too many files dispatches the event', function(){
                expect(tooManyEvent.type).to.equal('hemulen-toomany');
            });

            it('hemulen-toomany.hemulen has the expected value', function(){
                expect(tooManyEvent.hemulen).to.deep.equal(foo);
            });

            it('hemulen-toomany.hemulenElId has the expected value', function(){
                expect(tooManyEvent.hemulenElId).to.equal(fooElId);
            });

            it('hemulen-toomany.files has the expected value', function(){
                expect(tooManyEvent.files).to.deep.equal(testFiles);
            });
        });
        
        describe('hemulen-invalid', function(){
            describe('wrong type', function(done){
                var wrongTypeEvent;
                before(function(done){
                    foo = new Hemulen({
                        dropInput: '.foo__drop-field',
                        hemulenEl: '.foo',
                        namespace: 'foo',
                        acceptTypes: ['image/jpeg'],
                        fileMaxSize: 10000000,
                        fileLimit: 1
                    });
                    
                    fooElId = foo.getHemulenElId(fooEl);

                    function handleWrongType(e){
                        wrongTypeEvent = e;
                        fooEl.removeEventListener('hemulen-invalid', handleWrongType);                
                        done();
                    }
                    fooEl.addEventListener('hemulen-invalid', handleWrongType, false);
                    foo.storeFiles(fooElId, [testFileWrongType]);                     
                });

                after(function(){
                    foo.destroy(fooElId);
                });

                it('attempting to store one file with that is too big type dispatches the hemulen-invalid error', function(){
                    expect(wrongTypeEvent.type).to.equal('hemulen-invalid');
                });

                it('hemulen-invalid.hemulen has the expected value', function(){
                    expect(wrongTypeEvent.hemulen).to.deep.equal(foo);
                });

                it('hemulen-invalid.hemulenElId has the expected value', function(){
                    expect(wrongTypeEvent.hemulenElId).to.equal(fooElId);
                });

                it('hemulen-invalid.hemulenErrors has a length of 1', function(){
                    expect(wrongTypeEvent.hemulenErrors.length).to.equal(1);
                });

                it('hemulen-invalid.hemulenErrors[0].errorType equals \'wrong type\'', function(){
                    expect(wrongTypeEvent.hemulenErrors[0].errorType).to.equal('wrong type');
                });
            
                it('hemulen-invalid.hemulenErrors[0].file is the invalid file', function(){
                    expect(wrongTypeEvent.hemulenErrors[0].file).to.deep.equal(testFileWrongType);
                })
            });

            describe('too big', function(){
                var tooBigEvent;

                before(function(done){
                    foo = new Hemulen({
                        dropInput: '.foo__drop-field',
                        hemulenEl: '.foo',
                        namespace: 'foo',
                        acceptTypes: ['image/jpeg'],
                        fileMaxSize: 1,
                        fileLimit: 1
                    });
                    
                    fooElId = foo.getHemulenElId(fooEl);

                    function handleWrongSize(e){
                        tooBigEvent = e;
                        fooEl.removeEventListener('hemulen-invalid', handleWrongSize);
                        done();                
                    }                    
                    fooEl.addEventListener('hemulen-invalid', handleWrongSize, false);
                    foo.storeFiles(fooElId, [testFileValid]);  
                });

                after(function(){
                    foo.destroy(fooElId);
                });

                it('attempting to store one file with the wrong file type dispatches the hemulen-invalid error', function(){
                    expect(tooBigEvent.type).to.equal('hemulen-invalid');
                });

                it('hemulen-invalid.hemulen has the expected value', function(){
                    expect(tooBigEvent.hemulen).to.deep.equal(foo);
                });

                it('hemulen-invalid.hemulenElId has the expected value', function(){
                    expect(tooBigEvent.hemulenElId).to.equal(fooElId);
                });

                it('hemulen-invalid.hemulenErrors has a length of 1', function(){
                    expect(tooBigEvent.hemulenErrors.length).to.equal(1);
                });

                it('hemulen-invalid.hemulenErrors[0].errorType equals \'too big\'', function(){
                    expect(tooBigEvent.hemulenErrors[0].errorType).to.equal('too big');
                });
            
                it('hemulen-invalid.hemulenErrors[0].file is the invalid file', function(){
                    expect(tooBigEvent.hemulenErrors[0].file).to.deep.equal(testFileValid);
                });
            });
        });
    });

}());