;(function(){
	'use strict';

    var expect = chai.expect;

    var count = 0;
    var fileCount = 3;
	var fileIds = [];
    var storage;
    var subData;
    var testFile;

    var foo, fooElId;
    var fooEl   = document.getElementById('foo');
    var fooForm = document.getElementById('fooform');

    var builder = new WebKitBlobBuilder();
    builder.append(hemulenTestData.imageURI);
    testFile = builder.getBlob('image/jpeg');

    function handleAddFile (e) {
        count++;

        fileIds.push(e.fileId);

        foo.addData(fooElId, e.fileId, hemulenTestData.associatedValues);

        if (count === fileCount) {
            storage = foo._getStorage(fooForm);
            subData = foo._createSubData(storage.filesStored, hemulenTestData.mockFormData);
        }
    }

    describe('Hemulen data', function () {
        before(function(){
            foo = new Hemulen({
                hemulenEl: '.foo',
                namespace: 'foo'
            });
            fooElId = foo.getHemulenElId(fooEl);

            fooEl.addEventListener('hemulen-filestored', handleAddFile);

            for (var i = 0, j = fileCount; i < j; i++) {
                foo.storeFiles(fooElId, [testFile]);
            }
        });

        it('merges Hemulen\'s internal data storage object with a second object', function () {
            expect(subData.foo).to.equal('foo');
            expect(subData.bar).to.equal('bar');
            expect(subData.baz).to.equal('baz');

            for (var i = 0, j = fileIds.length; i < j; i++) {
                expect(subData['foo0file' + i]).to.exist;
            }
        });

        it('flattens the structure of Hemulen\'s internal data storage object', function(){
            for (var i = 0, j = fileIds.length; i < j; i++) {
                var fileId = fileIds[i];
                expect(storage.filesStored.foo[fooElId][fileId].file).to.equal(subData['foo0file' + i]);
                expect(storage.filesStored.foo[fooElId][fileId].foo).to.equal(subData['foo0foo' + i]);
                expect(storage.filesStored.foo[fooElId][fileId].bar).to.equal(subData['foo0bar' + i]);
                expect(storage.filesStored.foo[fooElId][fileId].baz).to.equal(subData['foo0baz' + i]);
            }
        });

        it('follows the key-naming pattern', function(){
            for (var i = 0, j = fileIds.length; i < j; i++) {
                expect(subData).to.have.ownProperty('foo0file' + i);
                expect(subData).to.have.ownProperty('foo0foo' + i);
                expect(subData).to.have.ownProperty('foo0bar' + i);
                expect(subData).to.have.ownProperty('foo0baz' + i);
            }
        });
    });
}());
