;(function(){
    'use strict';

    var expect = chai.expect;

    describe('Browser API Dependencies', function(){
        var doc = document.documentElement;

        var foo = new Hemulen({
            dropInput: '.foo__drop-field',
            hemulenEl: '.foo',
            namespace: 'foo'
        });

        beforeEach(function(){
            doc.classList.remove('hemulen-incompatible');
        });

        describe('Drag and Drop API', function(){
            it('document element has class \'hemulen-incompatible\' if draggable property is undefined', function(){
                foo._testBrowserApis({
                    testElement: {}
                });

                expect(doc.classList.contains('hemulen-incompatible')).to.be.true;                
            }); 
        });

        describe('File API', function(){
            it('document element has class \'hemulen-incompatible\' if File API is undefined', function(){                
                foo._testBrowserApis({
                    testEnvironment: {}
                });

                expect(doc.classList.contains('hemulen-incompatible')).to.be.true;                
            }); 

        });
    });

}());
