var express = require('express');
var r = require('rethinkdb');

var app = express();

app.get('/', (_,res) => res.send('Hello, world!\n') );

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

app.post('/temp', (req, res) => recordTemperature(req.query.v, res));

// GET is only added to allow easy testing
app.get('/temp/:temp', (req, res) => recordTemperature(req.params.temp, res));

function recordTemperature(temp, res) {
    console.log('Temperature', temp);
    res.send('OK\n');
}

