// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var request = require('request');
var Buffer = require('buffer').Buffer;
var infra = require('./infraProperties.js');


exports.get = function (url,callback,socket) {
  var uri = "";
  if (infra.port != 80)
    uri ='http://'+infra.host+":"+infra.port+infra.root+url
  else
    uri ='http://'+infra.host+infra.root+url

  console.log('http://'+infra.host+":"+infra.port+infra.root+url);
  require('request').get({
    uri: uri,
    headers:{'content-type': 'application/x-www-form-urlencoded'},

    },function(err,res,body){
        console.log(res.statusCode);
		if ( res.statusCode == 200) {
		  var buffer = new Buffer(body, 'ascii');
          var response = buffer.toString().substr(1);
          console.log(response);
          callback(response,socket);
	    }
   });
}


exports.post = function (data,url,callback,socket) {
var post_domain = infra.host;  
var post_port = infra.port;  
var post_path = infra.root+url;  

var post_data = querystring.stringify(data);  

var post_options = {
  host: post_domain,  
  port: post_port,  
  path: post_path,  
  method: 'POST',  
  headers: {  
    'Content-Type': 'application/x-www-form-urlencoded',  
    'Content-Length': post_data.length  
  }  
};
console.log(post_path);
var post_req = http.request(post_options, function(res) { 
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('Response: ' + chunk);  
    
    var buffer = new Buffer(chunk, 'ascii');
    
    response = buffer.toString();
    console.log(response);

    var regex = /\{.*\}/;
    response = response.match(regex)
    
    console.log(response[0]);

    parsedResponse = JSON.parse(response[0]);
    callback(parsedResponse, res.statusCode,socket);
  });
});
  
// write parameters to post body  
post_req.write(post_data);  
post_req.end();

}
