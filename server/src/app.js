var express = require('express');
var r = require('rethinkdb');

var app = express();

r.connect({host:'rt'}).then(cn => {
    app._rConn = cn;
    console.log("Got connection: ", cn);
})


app.get('/', (_,res) => res.send('Hello, world!\n') );

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

app.post('/temp', (req, res) => recordTemperature(req.query.v, res));

// GET is only added to allow easy testing
app.get('/temp/:temp', (req, res) => recordTemperature(req.params.temp, res));

function recordTemperature(temp, res) {
    console.log('Temperature', temp);
    r.table('weather').insert({
	timestamp: new Date().toISOString(),
	temperature: parseFloat(temp)
    }).run(app._rConn).then(() => res.send('OK\n'));
}


app.get('/temps', dumpTableHandlerFor('weather'));

function dumpTableHandlerFor(table) {
    return (req, res) =>
	r.table(table).run(app._rConn)
	.then((c) => c.toArray())
	.then((r) => res.json(r));
}


app.get('/t1', dumpTableHandlerFor('t1'));



