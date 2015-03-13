var fooBarBaz = {
    foo: {
        foo:{
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        },
        bar:{
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        },
        baz:{
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        }
    },
    bar: {
        foo:{
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        },
        bar:{
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        },
        baz:{
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        }
    },
    baz: {
        foo:{
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        },
        bar:{
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        },
        baz:{
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        }
    },
};

function mergeData(storedData, formData){
    var propname    = '',
        counter     = 0;

        for (var foo in storedData) {
            if (storedData.hasOwnProperty(foo)){
                propname    = foo;
                
                if (storedData[foo].constructor === Object) {
                    for (var bar in storedData[foo]) {
                        if (storedData[foo].hasOwnProperty(bar)) {
                            
                            if (storedData[foo][bar].constructor === Object) {    
                                for (var baz in storedData[foo][bar]) {
                                    if (storedData[foo][bar].hasOwnProperty(baz)) {
                                        formData[propname + counter + baz] = storedData[foo][bar][baz];                                          
                                    }
                                }
                            }
                            
                            counter++;                            
                        }
                    }
                }

                counter = 0;
            }
        }

        return formData;
}
console.log(mergeData(fooBarBaz, {}));

//foo0foo: 'foo'
//foo0bar: 'bar'
//foo0baz: 'baz'
//foo1foo: 'foo'
//foo1bar: 'bar'
//foo1baz: 'baz'
//foo2foo: 'foo'
//foo2bar: 'bar'
//foo2baz: 'baz'

//bar0foo: 'foo'
//bar0bar: 'bar'
//bar0baz: 'baz'
//bar1foo: 'foo'
//bar1bar: 'bar'
//bar1baz: 'baz'
//bar2foo: 'foo'
//bar2bar: 'bar'
//bar2baz: 'baz'

//baz0foo: 'foo'
//baz0bar: 'bar'
//baz0baz: 'baz'
//baz1foo: 'foo'
//baz1bar: 'bar'
//baz1baz: 'baz'
//baz2foo: 'foo'
//baz2bar: 'bar'
//baz2baz: 'baz'


// function translateData(data){
//     var returnData = {},
//         counter     = -1,
//         propname    = '';

//         function _iterate(dataItem, key) {
//             if (dataItem.constructor === Object) {
//                 for (var key in dataItem) {
//                     counter++;
//                     _iterate(dataItem[key], key);                        
//                 }
//             } else {
//                 counter = counter - 1;
//                 returnData[propname + '-' + counter + '-' + key] = dataItem;

//             }                 
//         }

//         for (var key in data) {
//             propname    = key;
//             counter     = -1;
//             _iterate(data[key], key);
//         }


//         return returnData;
// }