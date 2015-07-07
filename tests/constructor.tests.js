;(function(){
    'use strict';

    var expect = chai.expect;

    describe('Hemulen Constructor', function(){
        var foo, hemulenElId;

        //SETUP

        beforeEach('instantiate the Hemulen class', function(){
            foo = new Hemulen({
                hemulenEl: '.foo',
                namespace: 'foo',
                beforeSub: function(){console.log('beforeSub');}
            });
            hemulenElId = foo.getHemulenElId(document.getElementById('foo'));
        });

        afterEach('destroy Hemulen class instance', function(){
            foo.destroy(hemulenElId);            
        });

        //TESTS

        it('returns an object', function(){
            expect(foo).to.be.a('object');
        });

        it('returned object has configuration values', function(){            
            expect(foo.hemulenEl).to.equal('.foo');
        });

        it('throws an error if called without config object', function(){
            expect(function(){
                new Hemulen();
            }).to.throw(/Invalid Hemulen configuration./);
        });

        it('throws an error if config.hemulenEl is undefined', function(){
            expect(function(){
                new Hemulen({
                    dropInput: '.foo__drop-field',
                    namespace: 'foo'
                });
            }).to.throw(/hemulenEl is a required configuration option and must be a CSS selector string./); 
        });

        it('throws an error if config.hemulenEl is not a string', function(){
            expect(function(){
                new Hemulen({
                    dropInput: '.foo__drop-field',
                    hemulenEl: 1,
                    namespace: 'foo'
                });
            }).to.throw(/hemulenEl is a required configuration option and must be a CSS selector string./); 
        });

        it('throws an error if config.namespace is undefined', function(){
            expect(function(){
                new Hemulen({
                    dropInput: '.foo__drop-field',
                    hemulenEl: '.foo'
                });
            }).to.throw(/namespace is a required configuration option and must be a CSS selector string./); 
        });

        it('throws an error if config.namespace is not a string', function(){
            expect(function(){
                new Hemulen({
                    dropInput: '.foo__drop-field',
                    hemulenEl: '.foo',
                    namespace: 1
                });
            }).to.throw(/namespace is a required configuration option and must be a CSS selector string./); 
        });
    });
}());

