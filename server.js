var fs = require('fs');
var express = require('express');
var url  = require('url');
var path = require('path');

//var cookieParser = require('cookie-parser');
//var session = require('express-session');

var app = express();
app.use(express.static());
app.use(express.static(path.join("__dirname", 'dist')));
//app.use(cookieParser('S3CRE7'));
//app.use(session());
app.get('/', function (req, res) {
  var request_page_url = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.render('./index.html', {}
    )
})
app.listen(3004, function () {
  console.log('Listening on port 3004!');
})