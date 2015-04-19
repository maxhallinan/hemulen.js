;(function(){
    'use strict';

    var expect = chai.expect;

    var fooEl = document.getElementById('foo');
    var foo, fooElId;

    var testFileValid, testFileWrongType, testFileId;

    describe('Hemulen Events', function(){
        before(function(done){
            var req = new XMLHttpRequest();
            req.responseType = 'arraybuffer';
            req.onreadystatechange = function(e){
                if (req.readyState === 4) {
                    testFileValid       = new Blob([req.response], {type: 'image/jpeg'});
                    testFileWrongType   = new Blob([req.response], {type: 'image/gif'});

                    done();                    
                }
            };
            req.open('GET', '/tests/data/test.jpg', true);
            req.send();
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