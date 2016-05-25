// Feed current weather data from Perugia to weatherdb server

const http = require('http'),
      apikey = require('./apikey'),
      PerugiaCityId = 3171180;


var s='value=hello',
    options = {
	host: 'server',
	port: 3000,
	path: '/temp',
	method: 'POST',
	headers: {
	    'Content-Type': 'application/x-www-form-urlencoded'
	}
    };


function readAndSendTemperature() {
    console.log('Getting current temperature');
    http.get(`http://api.openweathermap.org/data/2.5/weather?id=${PerugiaCityId}&units=metric&&appid=${apikey.key}`,
	     res => {
		 res.setEncoding('utf8');
		 res.on('data', sendTemperature)
	     });
}

function sendTemperature(s) {
    var data = `v=${JSON.parse(s).main.temp}`,
	req;

    options.headers['Content-Length'] = data.length;
    console.log('Sending ', data);
    req = http.request(options);
    req.on('error', errorLogger);
    req.write(data);
    req.end();
    setTimeout(readAndSendTemperature, 1000 * 60 * 15);
}

function errorLogger(e) {
    console.log(`problem with request: ${e.message}`);
}

readAndSendTemperature();
