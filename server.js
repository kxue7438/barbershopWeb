var express = require('express');
var app = express();
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
// views is directory for all template files
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var validpages = '/:param(index|hours|about|contact)?';

app.get('*', function (request, response) {
	response.render('index.html');
});

app.post('/message', function (request, response) {
	console.log(request.toString());
	response.end(request.toString());
	sendgrid.send({
		to: 'warfieldsbarber@gmail.com',
		from: request.body.email,
		subject: request.body.subject,
		text: 'From: ' + request.body.name + ',\n' + request.body.message,
	}, function (err, json) {
		if (err) { return console.error(err); }
		console.log(json);
	});

	response.end("yay");
});

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});