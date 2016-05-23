'use strict';

const http = require('http'),
      fs = require('fs'),
      r = require('rethinkdb'),
      PORT = 80,
      server = http.createServer(handle);

r.connect({host:'rethinkdb'}).then(startServer);

function startServer(conn) {
    server._rConn = conn;
    console.log('Connected to DB...');
    server.listen(PORT, () => console.log('Server started...'));
}

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
    case '/data':
	data(res);
	break
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

function data(res) {
    res.setHeader('Content-Type', 'application/json');
    r.table('weather').run(server._rConn)
	.then(c => c.toArray())
	.then(o => res.end(JSON.stringify(o)))
    	.error(e => handleError(res, e));
}

function handleError(res, err) {
    res.statusCode = 500;
    res.statusMessage = 'Internal server error';
    res.end(err);
}
