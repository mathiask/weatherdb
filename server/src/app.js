'use strict';


const app = require('express')(),
      bodyParser = require('body-parser'),
      r = require('rethinkdb');

app.use(bodyParser.urlencoded({ extended: true }));

r.connect({host:'rethinkdb'})
    .then(rememberConnection)
    .then(ensureThatTableExists('weather'))
    .then(startServer);


function rememberConnection(conn) {
    app._rConn = conn;
    console.log('Got connection: ', conn);
}

function ensureThatTableExists(t) {
    return () => {
	console.log('Checking table');
	r.db('test').tableList().contains(t).run(app._rConn)
	    .then(b => {
		console.log('Table', t, 'found:', b);
		return b ? null : r.db('test').tableCreate(t).run(app._rConn);
	    });
    };
}


function startServer() {
    app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
    });
}


app.get('/', (_,res) => res.send('Hello, world!\n') );


app.post('/temp', (req, res) => recordTemperature(req.body.v, res));

// GET is only added to allow easy testing
app.get('/temp/:temp', (req, res) => recordTemperature(req.params.temp, res));

function recordTemperature(temp, res) {
    console.log('Temperature', temp);
    r.table('weather').insert({
	timestamp: new Date().toISOString(),
	temperature: parseFloat(temp)
    }).run(app._rConn)
	.then(() => res.send('OK\n'))
	.error(handleError(res));
}

function handleError(res) {
    return e => {
	console.error(e);
	res.status(500).send('Internal server error\n');
    };
}


app.get('/temps', dumpTableHandlerFor('weather'));

function dumpTableHandlerFor(table) {
    return (_, res) =>
	r.table(table).run(app._rConn)
	.then(c => c.toArray())
	.then(r => res.json(r))
    	.error(handleError(res));
}


app.get('/t1', dumpTableHandlerFor('t1'));
