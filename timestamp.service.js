const _TIMESTAMP_FORMAT = "X";
const _NATURAL_FORMAT = "MMMM DD YYYY";

const _ERROR_MSG = "Error while processing time input.";

function processTimeInput(timeInput) {
	let moment = require('moment');

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
		outNatural = inputDate.format(_NATURAL_FORMAT);
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

if (process.argv.length > 2) {
	let http = require('http');
	let url = require('url');

	let server = http.createServer(
		function callback (request, response) {
			let path = getPath(request.url, process.argv[3]);
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
	);
	server.listen(process.argv[2]);
}
