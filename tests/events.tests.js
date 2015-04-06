;(function(){
    'use strict';

    var expect = chai.expect;

    var foo = new Hemulen({
        dropInput: '.foo__drop-field',
        hemulenEl: '.foo',
        namespace: 'foo',
        acceptTypes: ['image/jpeg'],
        fileMaxSize: 10000000,
        fileLimit: 1
    });

    var fooEl       = document.getElementById('foo');
    var fooElId     = foo.getHemulenElId(fooEl);
    
    var testFileValid;
    var testFileWrongType;
    var testFileId;

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

        it('storing a file dispatches the hemulen-filestored event', function(done){
            function handleFileStored(e){
                testFileId = e.fileId;
                
                expect(e.file.size).to.equal(testFileValid.size);
                expect(e.file.type).to.equal(testFileValid.type);
                expect(e.type).to.equal('hemulen-filestored');

                fooEl.removeEventListener('hemulen-filestored', handleFileStored);
    
                done();                
            }

            fooEl.addEventListener('hemulen-filestored', handleFileStored, false);

            foo.storeFiles(fooElId, [testFileValid]);
        });

        it('deleting a file dispatches the hemulen-filedeleted event', function(done){
            function handleFileDeleted(e){
                expect(e.type).to.equal('hemulen-filedeleted');

                fooEl.removeEventListener('hemulen-filedeleted', handleFileDeleted);

                done();                
            }

            fooEl.addEventListener('hemulen-filedeleted', handleFileDeleted, false);

            foo.deleteFile(fooElId, testFileId);
        });

        it('a file of the wrong type dispatches the hemulen-invalid event', function(done){
            function handleWrongType(e){
                expect(e.type).to.equal('hemulen-invalid');
                expect(e.hemulenErrors[0].errorType).to.equal('wrong type');

                fooEl.removeEventListener('hemulen-invalid', handleWrongType);                
                
                done();
            }

            fooEl.addEventListener('hemulen-invalid', handleWrongType, false);

            foo.storeFiles(fooElId, [testFileWrongType]);            
        });

        it('a file of the wrong size dispatches the hemulen-invalid event', function(done){
            var originalFileMaxSize = foo.fileMaxSize;
            foo.fileMaxSize = 1;

            function handleWrongSize(e){
                expect(e.type).to.equal('hemulen-invalid');
                expect(e.hemulenErrors[0].errorType).to.equal('too big');

                foo.fileMaxSize = originalFileMaxSize;

                fooEl.removeEventListener('hemulen-invalid', handleWrongSize);

                done();                
            }

            fooEl.addEventListener('hemulen-invalid', handleWrongSize, false);

            foo.storeFiles(fooElId, [testFileValid]);            
        });

        it('too many files dispatches the hemulen-toomany event', function(done){
            function handleTooMany(e){
                expect(e.type).to.equal('hemulen-toomany');

                fooEl.removeEventListener('hemulen-toomany', handleTooMany);
                done();                
            }

            fooEl.addEventListener('hemulen-toomany', handleTooMany, false);

            foo.storeFiles(fooElId, [testFileValid, testFileValid]);
        });



    });

}());