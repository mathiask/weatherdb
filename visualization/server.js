'use strict';

const http = require('http'),
      fs = require('fs'),
      PORT = 80,
      server = http.createServer(handle);

function handle(req, res) {
    switch(req.url) {
    case '/ok':
	res.end('OK\n');
	break;
    case '/':
    case '/index.html':
	serveStatic('index.html', res, 'text/html');
	break;
    case '/p5.min.js':
	serveStatic(req.url.slice(1), res, 'text/javascript');
	break;
    default:
	res.statusCode = 404;
	res.statusMessage = 'Not found';
	res.end();
	break;
    }
}

function serveStatic(filename, res, contentType) {
    res.setHeader('Content-Type', contentType);
    fs.readFile(filename, 'binary', (_, s) => res.write(s, () => res.end()));
}

server.listen(PORT, () => console.log('Server started...'));
