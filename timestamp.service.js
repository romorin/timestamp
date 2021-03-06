const _TIMESTAMP_FORMAT = "X";
const _NATURAL_FORMAT = "MMMM DD YYYY";
const _NATURAL_OUTPUT_FORMAT = "MMMM DD, YYYY";
const _ERROR_MSG = "Error while processing the time input.";

const fs = require('fs');
const http = require('http');
const url = require('url');
const moment = require('moment');
const ReplaceTransform = require('./replace-transform');
const nodepath = require('path');

// process the string input and returns the output json
function processTimeInput(timeInput) {
	// try timestamp then natural
	let inputDate = moment.utc(timeInput, _TIMESTAMP_FORMAT, true);
	if (!inputDate.isValid()) {
		let formattedInput = timeInput.replace(/%20/g, ' ');
		inputDate = moment.utc(formattedInput, _NATURAL_FORMAT);
	}

	// get the output components
	let outTimestamp = null;
	let outNatural = null;
	if (inputDate.isValid()) {
		outTimestamp = Number(inputDate.format(_TIMESTAMP_FORMAT));
		outNatural = inputDate.format(_NATURAL_OUTPUT_FORMAT);
	}

	// generate json
	return { "unix": outTimestamp, "natural": outNatural } ;
}

// get the part containing the parameters to manage when the app sits on a subpath
function getPath(urlStr, basePath) {
	let startIndex = 1;
	if (basePath) {
		startIndex = basePath.length;

		if (basePath[basePath.length -1] !== '/') {
			startIndex += 1;
		}
	}
	return urlStr.substr(startIndex);
}

// get the address where the server sits
function getAddr(request, basePath) {
	let addr = request.headers.host;
	if (basePath) {
		addr += basePath;
	}
	return addr;
}

// lunch the timestamp service
function launchServer(port, basePath) {
	let server = http.createServer(
		function callback (request, response) {
			let path = getPath(request.url, basePath);
			let transformer = new ReplaceTransform(/%%URL%%/g, getAddr(request, basePath));

			// display a help message
			if (path === '') {
				response.writeHead(200, { 'Content-Type': 'text/html' });
				fileStream = fs.createReadStream(nodepath.join(__dirname,'hello.html'));
				fileStream.pipe(transformer).pipe(response);
			}
			else {
				let result = processTimeInput(path);

				if (result) {
					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.write(JSON.stringify(result));
				}
				else {
					response.writeHead(400, { 'Content-Type': 'text/plain' });
					response.write(_ERROR_MSG);
				}
				response.end();
			}
		}
	);
	server.listen(port);

	return server;
}

// handle imports
exports.launchServer = launchServer;

// handle direct calls
if (require.main === module && process.argv.length > 2) {
	launchServer(process.argv[2], process.argv[3]);
}
