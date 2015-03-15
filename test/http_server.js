var http            = require('http'),
    formidable      = require('formidable');


var collectData = '',
    responseData = {
        "redirectUrl" : 'http://localhost:4567/form-event-success.html'
    };


var server = http.createServer(function(req, res){

    //CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    //ROUTING
    switch (req.method.toLowerCase()) {
        case 'post':
            var form = new formidable.IncomingForm();

            form.parse(req, function(err, fields, files){
                console.log('FIELDS: ', fields);
                console.log('FILES: ', files);
            });            
            break;
    }

    // res.writeHead(500, {'Content-Type': 'text/plain'});
    // res.write('Request failed :(');
    res.writeHead(200, {'Content-Type':'application/json'});
    res.write(JSON.stringify(responseData));
    res.end();
});


//listen on port number passed as the first command line argument
server.listen(Number(process.argv[2]), function(){console.log('This server is listening at port: ' + process.argv[2])});