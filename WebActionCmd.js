#!/usr/bin/env node

const fs = require('fs');  // https://nodejs.org/api/fs.html#fs_fs_accesssync_path_mode
const EXECUTESHELLCMD = require( __dirname + "/ExecShellCommand.js");

const request = require('request'); // https://www.npmjs.com/package/request
							// https://nodejs.org/api/http.html#http_class_http_incomingmessage
// var requestSync = require('sync-request'); // https://github.com/ForbesLindesay/sync-request
// I HATE the way sync-request causes POPUPs on MacOS and Windows 10 - alerting user to attempts to open firewall

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

/**
 * See HOW-TO write JS to process a URL's response at https://stackabuse.com/the-node-js-request-module/
 * Full NodeJS documentation of request module @ https://www.npmjs.com/package/request 
 * @param {*} _urloptions something like: { url: _url,  resolveWithFullResponse: true, headers: { 'User-Agent': 'request' } }
 * @param {*} _filePath path to the file into which the RESPONSE body is written to
 */
var Promise_URL2File = 
function Promise_URL2File( _urloptions, _filePath ) { 

	if (process.env.VERBOSE) console.log( __filename + ": Promise_URL2File(): _urloptions = ["+ _urloptions +"]");;

	// WARNING the "success" and "reject" functions in the PROMISE below can ONLY take ONE SINGLE parameter-argument.
	return new Promise((success, reject) => {
		var urlStatusCode = -1;

		const fileStream = fs.createWriteStream( _filePath, { flags: "w", mode: 0o666 } );  // https://nodejs.org/api/fs.html#fs_file_system

		const req = request.get( _urloptions, function( _err8, _response, _body) {
			// The code below executes AFTER completion of req.on('response', ..) ---- see below

			// "response" (2nd parameter) is of type:  https://nodejs.org/api/http.html#http_class_http_incomingmessage
			// if ( response ) response.statusCode &  it's string equivalent response.statusMessage
			// if ( response ) response.headers['content-type'] == 'image/png' 'application/json' 'multipart/form-data'
			//					response.Headers = [{"date":"Tue, 16 Apr 2019 21:12:18 GMT","server":"Apache","content-length":"332","connection":"close","content-type":"text/html; charset=iso-8859-1"}]
			// if ( response ) response.aborted property will be true if the request has been aborted
			// if ( response ) response.complete property will be true if a complete HTTP message has been received and successfully parsed.
			//					if (!response.complete) console.error( 'The connection was terminated while the message was still being sent'); });
			// if ( response ) response..headers -- The request/response headers object.   Key-value pairs of header names and values. Header names are lower-cased.
			// if ( response ) response.rawHeaders -- a simple string

			// Did the response have HTTP Code of 200?  Well!! Checkout the function-scope variable: urlStatusCode
			// if "err" is NULL, then there was SOME "valid" response from server - even if it's 404.

			// If URL is totally MALformed .. then statusCode=-1 err=[Error: Invalid protocol: xXhtXtp:]  body=[undefined]
			// If URL DNS name is invalid .. then statusCode=-200 as https://searchassist.verizon.com responds for all INVALID DNS names!

			if ( urlStatusCode == -1 && _response ) urlStatusCode = _response.statusCode; // assuming urlStatusCode is NOT already set

			if ( process.env.VERBOSE ) console.log( __filename + ": Promise_URL2File(): request.get(..): returned code="+ urlStatusCode + " -- [" + _err8 +"]");
			if ( process.env.VERBOSE && _body ) console.log( __filename + ": Promise_URL2File(): request.get(..): returned body= [" + _body +"]!!!!!!!");
			if ( process.env.VERBOSE && _response ) console.log( __filename + ": Promise_URL2File(): response.Headers=["+ JSON.stringify(_response.headers) +"]!!!!!!!");

		});
		// const req = request.get( _urloptions, response => {
			// The code below executes AFTER completion of req.on('response', ..) ---- see below
			// if (response.statusCode === 200) {
			// 	response.pipe(fileStream);
			// } else {
			// 	fileStream.close();
			// 	fs.unlink( _filePath, () => {}); // Delete temp file
			// 	reject(response.statusCode, `Server responded with ${response.statusCode}: ${response.statusMessage}`);
			// }
		// });

		req.on('response', function(response) { // 'response' of of type http.IncomingMessage
			if ( process.env.VERBOSE ) console.log( __filename + ": Promise_URL2File(): req.on('response'..): " + response.statusCode +"\n"+ response.statusMessage ) // <--- Here 200
			urlStatusCode = response.statusCode;
			if (response.statusCode === 200) {
				response.pipe(fileStream); // This is identical to contents of 'bodyStr' function-level variable.
			} else {
				fileStream.close();
				fs.unlink( _filePath, () => {}); // Delete temp file
				// reject( [ response.statusCode, `Server responded with ${response.statusCode}: ${response.statusMessage}` ] );
				reject( [ response.statusCode, response.statusMessage ] );
			}
		});

		req.on("error", err => {
			if ( process.env.VERBOSE ) console.log( __filename + ": req.on('ERROR'..): " + response.statusCode +"\n"+ response.statusMessage ) // <--- Here 200
			urlStatusCode = response.statusCode;
			fileStream.close();
			fs.unlink( _filePath, () => {}); // Delete temp file
			reject( [ response.statusCode, err.message ] );
		});

		fileStream.on("finish", () => {
			if ( process.env.VERBOSE ) console.log( __filename + ": fileStream.on(finish, ..): ");
			success( [ urlStatusCode, "success" ] );
		});

		fileStream.on("error", err => {
			console.log( __filename + ": fileStream.on(ERROR, ..): ");
			fileStream.close();

			if (err && err.code === "EEXIST") {
				reject( [ urlStatusCode, "File already exists" ] );
			} else {
				fs.unlink( _filePath, () => {}); // Delete temp file
				reject( [ urlStatusCode, err.message ? err.message : __filename + ": fileStream.on(ERROR, ..): Unknown error" ] ) ;
			}
		});

	}); // return Promise
};

exports.Promise_URL2File = Promise_URL2File;;

//-------------------------------------------

var bHTTPRequestCompleted = false;

exports.bHTTPRequestCompleted = bHTTPRequestCompleted;

//-------------------------------------------
/**
 * Pass a file and it's automtically written to, and it will be closed.
 * Use the _cb (callback) ***only*** if you need detailed errors.
 * @param {*} _url the URL you want, whether httpS or otherwise
 * @param {*} _urloptions something like: { url: _url,  resolveWithFullResponse: true, headers: { 'User-Agent': 'request' } }
 * @param {*} _filePath path to the file into which the RESPONSE body is written to
 * @param {*} _cb the callback function with 2 parameters (statusCode, string) -- where string is either HTTP-response-body or error-message
 */
exports.getURLAsFile =
function getURLAsFile( _url, _filePath, _cb  ) { 

	// Test this function - by creating a new JS file containing:
	// var EXECUTESHELLCMD = require( "/mnt/development/src/org.ASUX/ExecShellCommand.js" );
	// // EXECUTESHELLCMD.getURLAsFile( 'http://the-server.com/will-return/404', '/tmp/google', null );
	// // EXECUTESHELLCMD.getURLAsFile( 'http://google.com/doodle.png', '/tmp/google', null );
	// EXECUTESHELLCMD.getURLAsFile( 'XXXXXXXXXXXXXXXXhttp://google.com/doodle.png', '/tmp/google', null );
	// EXECUTESHELLCMD.getURLAsFile( 'http://ZZZZZZZZZZZZZZZZZZZZZ.com', '/tmp/google', null );
	
	bHTTPRequestCompleted = false; // initialize.  Assuming you're running single-threaded cmdline or back-end jobs
	request( _url, {}, (err, res, body) => {
		if (err) {
			console.log( __filename +": "+ err.toString() );
			bHTTPRequestCompleted = true;
			if ( _cb) _cb( false, errcode, err );
		} else {
			console.log( __filename +": "+ res.headers.toString() );
			console.log( __filename +": "+ body.toString() );
			// console.log(body.url);
			// console.log(body.explanation);
			try {
				const filedescr = fs.openSync( _filePath, "w", 0o644 ); // https://nodejs.org/api/fs.html#fs_fs_opensync_path_flags_mode
				fs.writeFileSync( filedescr, body, {} );
				fs.closeSync(filedescr);
				console.log( __filename +'wrote the file ['+ _filePath +']successfully');
			} catch(err) {
				const m = ": Error/Failure writing to file ["+ _filePath +"] - got error ["+ err +"]";
				console.error( __filename + m);
				fs.unlink( _filePath, () => {}); // Delete temp file
			}
			bHTTPRequestCompleted = true;
			if ( _cb) _cb( true, httpcode, "success" );
		} // if-else
	}); // request( url .. ..)

	//==================== FAILED TO USE PROMISES =====================
	// var URLOPTIONS = { url: _url,  resolveWithFullResponse: true }; //  headers: { 'User-Agent': 'request' }
	// var newPromise = Promise_URL2File( URLOPTIONS, _filePath );
	// newPromise.then(
	// 	function(httpcode) { // This function corresponds to the "success()" within the Promise
	// 		console.log( __filename + ": getURLAsFile(): SUCCESS http-code [" + httpcode +"]");
	// 		if ( _cb) _cb( true, httpcode, "success" );
	// 	},
	// 	function(_p2) { // This function corresponds to the "reject()" within the Promise
	// 		let [ errcode, err ] = _p2;
	// 		console.error( __filename + ": getURLAsFile(): Got HTTP-ERROR# [" + errcode +"] ["+ err +"]");
	// 		if ( _cb) _cb( false, errcode, err );
	// 	}
	// );

};

//-------------
/**
 * Pass a file and it's automtically written to, and it will be closed.
 * returns {*} [ true/false, httpcode, "success/error-message" ]
 * @param {*} _urloptions something like: { url: _url,  resolveWithFullResponse: true, headers: { 'User-Agent': 'request' } }
 * @param {*} _filePath path to the file into which the RESPONSE body is written to
 */

var getURLAsFileSynchronous = 
function getURLAsFileSynchronous( _url, _filePath ) {

	getURLAsFile( _url, _filePath, null  );
	EXECUTESHELLCMD.sleep(1); // in case the request is completed in < 2 seconds
	var bFirstIteration = true;
	while ( ! bHTTPRequestCompleted ); { // bHTTPRequestCompleted is set INSIDE the preceeding getURLAsFile()
		if ( bFirstIteration ) console.error( _url +" is taking too long ..  ");
		bFirstIteration = false;
		process.stdout.write('.');
		// there is NO sleep() in Javascript
		var currentTime = new Date().getTime();
		while (currentTime + (1000) >= new Date().getTime()) {}
	};

	// ===================== following code uses require("sync-request") =====================
	// console.error( __filename +": The function getURLAsFileSynchronous() is completely COMMENTED OUT.  Never like sync-request NPM Module");
	// var URLOPTIONS = { url: _url,  followRedirects: true, body: Buffer }; // see better examples in Aysnc version of function above.

	// var response = requestSync('GET', _url, URLOPTIONS );
	// // response.statusCode
	// // response.headers  response.headers=[{"accept-ranges":"bytes","cache-control":"max-age=604800","content-type":"text/html; charset=UTF-8","date":"Wed, 17 Apr 2019 17:09:11 GMT","etag":"\"1541025663+gzip\"","expires":"Wed, 24 Apr 2019 17:09:11 GMT","last-modified":"Fri, 09 Aug 2013 23:54:35 GMT","server":"ECS (phd/FD6F)","vary":"Accept-Encoding","x-cache":"HIT","content-length":"606","connection":"close"}]
	// // response.body -- either String or Buffer typeof.
	// // response.body.toString()
	// // if ( process.env.VERBOSE && _response )
	// if ( process.env.VERBOSE ) console.log( __filename + ": getURLAsFileSynchronous(): response.headers=["+ JSON.stringify(response.headers) +"]!!!!!!!");

	// if ( process.env.VERBOSE ) console.log( __filename +": response.body.size = "+ response.body.length )
	// const filedescr = fs.openSync( _filePath, "w", 0o666 ); // https://nodejs.org/api/fs.html#fs_fs_opensync_path_flags_mode
	// fs.writeSync( filedescr, response.body, 0, response.body.length, null, function(err) {
    //     if (err) {
	// 		const m = ": Error/Failure writing to file ["+ _filePath +"] - got error ["+ err +"]";
	// 		console.error( __filename + m);
	// 		throw m;
	// 	}
    //     fs.close(filedescr, function() {
    //         console.log('wrote the file ['+ _filePath +']successfully');
    //     });
    // });

	// if ( response.statusCode == 200 )
	// 	return [ response.statusCode, null ];
	// else
	// 	return [ response.statusCode, response.body.toString() ];

};

exports.getURLAsFileSynchronous = getURLAsFileSynchronous;;

// getURLAsFileSynchronous( 'https://s3.amazonaws.com/org.asux.cmdline/junit.junit.junit-4.8.222.jar', '/tmp/jar' );
// getURLAsFile( 'https://s3.amazonaws.com/org.asux.cmdline/junit.junit.junit-4.8.222.jar', '/tmp/jar', null );

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

/**
 * See HOW-TO write JS to process a URL's response at https://stackabuse.com/the-node-js-request-module/
 * Full NodeJS documentation of request module @ https://www.npmjs.com/package/request 
 * @param {*} _urloptions something like: { url: _url,  resolveWithFullResponse: true, headers: { 'User-Agent': 'request' } }
 * @param {*} _filePath path to the file into which the RESPONSE body is written to
 */
var Promise_URL2string = 
function Promise_URL2string( _urloptions ) { 

	var urlStatusCode = -1;
	var bodyStr = ""; // be careful .. as this variable may have a very large sized content coming from HTTP-response!
	if (process.env.VERBOSE) console.log( __filename + ": Promise_URL2string(): _urloptions = ["+ _urloptions +"]");

	// WARNING the "success" and "reject" functions in the PROMISE below can ONLY take ONE SINGLE parameter-argument.
	return new Promise((success, reject) => {
		const req = request.get( _urloptions, function( _err8, _response, _body) {
			if ( urlStatusCode == -1 && _response ) urlStatusCode = _response.statusCode; // assuming urlStatusCode is NOT already set
			if ( process.env.VERBOSE ) console.log( __filename + ": Promise_URL2string(): request.get(..): returned code="+ urlStatusCode + " -- [" + _err8 +"]");
			if ( process.env.VERBOSE && _body ) console.log( __filename + ": Promise_URL2string(): request.get(..): returned body= [" + _body +"]!!!!!!!");
			if ( process.env.VERBOSE && _response ) console.log( __filename + ": Promise_URL2string(): response.Headers=["+ JSON.stringify(_response.headers) +"]!!!!!!!");
			if ( _body ) {
				bodyStr = _body; // save it in function-level variable - to return on success.
				// be careful, with above statement, as _body could be arbitrarily large content.
				try {
					let jsonBody = JSON.parse(_body);
					if ( process.env.VERBOSE ) console.log("jsonBody: "+ jsonBody);
				} catch (errObj6) {
					if ( process.env.VERBOSE ) console.error( __filename + ": Promise_URL2string(): The URL response was NOT JSON! Duh! -- "+ errObj6);
					// process.exit(99); // Not a fatal an error.  So, ignoring the value of _bExitOnFail
				}
			}
		});

		req.on('response', function(response) { // 'response' of of type http.IncomingMessage
			if ( process.env.VERBOSE ) console.log( __filename + ": Promise_URL2string(): req.on('response'..): " + response.statusCode +"\n"+ response.statusMessage ) // <--- Here 200
			if ( response && response.statusCode ) urlStatusCode = response.statusCode;
			if (response.statusCode === 200) {
				success( [ urlStatusCode, bodyStr ] );
			} else {
				// reject( [ response.statusCode, `Server responded with ${response.statusCode}: ${response.statusMessage}` ] );
				reject( [ response.statusCode, response.statusMessage ] );
			}
		});

		req.on("error", err => {
			if ( process.env.VERBOSE ) console.log( __filename + ": req.on('ERROR'..): " + response.statusCode +"\n"+ response.statusMessage ) // <--- Here 200
			urlStatusCode = response.statusCode;
			reject( [ response.statusCode, err.message ] );
		});
	}); // return Promise
}

exports.Promise_URL2string = Promise_URL2string;

//----------------------------------------------
exports.getURLContentsAsText =
function getURLContentsAsText( _url, _filePath, _cb  ) { 

	// Test this function - by creating a new JS file containing:
	// var WEBACTIONCMD = require( "/mnt/development/src/org.ASUX/WebActionCmd.js" );
	// var WEBACTIONCMD = require( __dirname + "/../WebActionCmd.js" );
	// // WEBACTIONCMD.getURLContentsAsText( 'http://the-server.com/will-return/404', null );
	// // WEBACTIONCMD.getURLContentsAsText( 'http://google.com/doodle.png', null );
	// WEBACTIONCMD.getURLContentsAsText( 'XXXXXXXXXXXXXXXXhttp://google.com/doodle.png', null );
	// WEBACTIONCMD.getURLContentsAsText( 'http://ZZZZZZZZZZZZZZZZZZZZZ.com', null );
	
	var URLOPTIONS = { url: _url,  resolveWithFullResponse: true }; //  headers: { 'User-Agent': 'request' }
	var newPromise = Promise_URL2string( URLOPTIONS, _filePath );
	newPromise.then(
		function(httpcode) { // This function corresponds to the "success()" within the Promise
			console.log( __filename + ": getURLContentsAsText(): SUCCESS http-code [" + httpcode +"]");
			if ( _cb) _cb( true, httpcode, body );
		},
		function(_p2) { // This function corresponds to the "reject()" within the Promise
			let [ errcode, err ] = _p2;
			console.error( __filename + ": getURLContentsAsText(): Got HTTP-ERROR# [" + errcode +"] ["+ err +"]");
			if ( _cb) _cb( false, errcode, err );
		}
	);

};

// function NotAGoodWay2WriteCode( _url, _filePath, _cb  ) { 
		// const fileStream = fs.createWriteStream(_filePath); // https://nodejs.org/api/fs.html#fs_file_system
		// const sendReq = request.get(_url);
	
		// // verify response code
		// sendReq.on('response', (response) => {
		// 	if (response.statusCode !== 200) {
		// 		return cb('Response status was ' + response.statusCode);
		// 	}
	
		// 	sendReq.pipe(fileStream);
		// });
	
		// // close() is async, call cb after close completes
		// sendReq.on('finish', () => { if ( _cb) fileStream.close(_cb); else fileStream.close(); });
	
		// // check for request errors
		// sendReq.on('error', (errObj3) => {
		// 	fs.unlink(dest);
		// 	return _cb(errObj3.message);
		// });
	
		// fileStream.on('error', (errObj4) => { // Handle errors
		// 	fs.unlink(_filePath); // Delete the file async. (But we don't check the result)
		// 	return _cb(errObj4.message);
		// });
	// }); // end function

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

// DO NOT put anything below this line (basically, below the close-parenthesis in the previous line above)
//EoScript
//EoScript
//EoScript
//EoScript
//EoScript
