'use strict';

const http = require('http'),
      PORT = 80,
      server = http.createServer(handle);

function handle(req, res) {
    res.end('OK\n');
}

server.listen(PORT, () => console.log('Server started...'));
