#!/usr/bin/env node

var fs = require("fs");  // https://nodejs.org/api/fs.html#fs_fs_accesssync_path_mode
const CHILD_PROCESS = require('child_process'); // https://nodejs.org/api/child_process.html#child_process_class_childprocess

// child_process exec() & execFile() - offer a callback, that is invoked when the child process terminates.
// Spawn() typically is used to fire-n-forget processes.
// But.. SpawnSync works best for me, especially with git which writes to stdout + stderr simultaneously.

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

/** Switch to the FOLDER "cwd" (param #1)
 *	Exec "command" (param #2)
 *	cmdline arguments to pass to the "command" (param #3 is an array)
 *	true/false whether the OUTPUT of the "command" is dumped to console. (param #4)
 *	true/false whether THIS function is verbose.  Do NOT use the global process.env.VERBOSE. (param #5)
 *	true/false whether any failure should lead to an actual call to Process.EXIT(...) (param #6)
 */
// This allows other modules to invoke the above function
exports.executionPiped =
function( _newWorkingDir, _command, _cmdArgs, _quietlyRunCmd, _bVerbose2, _bExitOnFail, env ) {

	// console.log( `${__filename} : verbose = ${_bVerbose2}`);
	if (_bVerbose2) { console.log( `${__filename} : about to run command.  "${_command}" with cmdline arguments: ` + _cmdArgs.join(' ') ); }

	//----------------------
	try { // synchornous version of Javascript's child_process.execFile(...)
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Deep_Clone
		var envClone = (env != null) ? env : JSON.parse( JSON.stringify( process.env ) );
		const cpObj = CHILD_PROCESS.spawnSync( _command, _cmdArgs, {cwd: _newWorkingDir, timeout: 0, env: envClone } );
						// Why am I explicitly passing process.env?  Because I enhance 'process.env' in org.ASUX/asux.js
		if ( ! _quietlyRunCmd ) {
			if (_bVerbose2) console.log( `${__filename} : about to dump output from command (code=${cpObj.status}))\n${cpObj.stdout}\n`+ cpObj.stderr +"\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );
			// ok! dump the output from command - onto the console .. (after prefixing  '> ' chars to each line of output)
			var outStr1WPrefix = '';
			if ( cpObj.stdout ) outStr1WPrefix+=cpObj.stdout;
			if ( cpObj.stderr ) outStr1WPrefix+=cpObj.stderr;
			// prefix a '> ' for each line in outStr1.  Note, newlines are considered WHITESPACE
			function replStrFunc (match, p1, offset, string) { return '> ' + match; }
			outStr1WPrefix = outStr1WPrefix.replace(/^[^\n][^\n]*\n/mg, replStrFunc); // insert the prefix '> ' for each line in outStr1
			console.log( outStr1WPrefix );
		};
		return(cpObj.status);
	} catch (errObj4) {
		console.error("Error running command ["+ _command + "].  Exit code = "+ errObj4.code +"\n" + errObj4.toString());
		if ( _bExitOnFail ) process.exit( errObj4.code );
		else return(errObj4.code);
	}

	if (_bVerbose2) console.log( `${__filename} : DONE FINISHED command.  ${_command}` );
}

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

/** This variation of above function is to be USED ONLY INTERNALLY by asux.js - to invoke asux.js in subfolders.
 *	Switch to the FOLDER "cwd" (param #1)
 *	Exec "command" (param #2)
 *	cmdline arguments to pass to the "command" (param #3 is an array)
 *	true/false whether the OUTPUT of the "command" is dumped to console. (param #4)
 *	true/false whether THIS function is verbose.  Do NOT use the global process.env.VERBOSE. (param #5)
 *	true/false whether any failure should lead to an actual call to Process.EXIT(...) (param #6)
 */
// This allows other modules to invoke the above function
exports.executeSharingSTDOUT =
function( _newWorkingDir, _command, _cmdArgs, _quietlyRunCmd, _bVerbose2, _bExitOnFail, env ) {

	if (_bVerbose2) { console.log( `${__filename} : about to run command.  "${_command}" with cmdline arguments: ` + _cmdArgs.join(' ') ); }

	//----------------------
	try { // synchornous version of Javascript's child_process.execFile(...)
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Deep_Clone
		var envClone = (env != null) ? env : JSON.parse( JSON.stringify( process.env ) );
		const cpObj = CHILD_PROCESS.spawnSync( _command, _cmdArgs, { cwd: _newWorkingDir, stdio: 'inherit', timeout: 0, env: envClone } );
		var retCode;
		if ( cpObj.status == null ) {
			if ( cpObj.error != null ) {
				console.log( "!! ERROR in "+ __filename +"\nFailed to run the command '"+ _command +"' from within the folder '"+ _newWorkingDir +"'\n\nSpawnSync()'s return ERROR-Object's DETAILS =\n"+ JSON.stringify(cpObj.error) +"\n" );
				cpObj.status = 1;
			} else {
				console.log( "!! ERROR in "+ __filename +"\n__UNKNOWN__ SERIOUS INTERNAL FAILURE running command '"+ _command +"' from within the folder '"+ _newWorkingDir +"'\nBoth status and error of cpObj are NULL!\n"+ JSON.stringify(cpObj) );
				cpObj.status = 1;
			}
		}
		if (_bVerbose2) console.log( "Within"+ __filename +"\nRunning '"+ _command +"' gave cpObj.status=" + cpObj.status +" .... and cpObj="+ JSON.stringify(cpObj) +" .... and ERROR-ATTR="+ JSON.stringify(cpObj.error) );
						// Why am I explicitly passing process.env?  Because I enhance 'process.env' in org.ASUX/asux.js

		if ( ! _quietlyRunCmd ) {
			if (_bVerbose2) console.log( `${__filename} : about to dump output from command (code=${cpObj.status}))` +"\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n");
			if ( cpObj.stdout ) console.log(cpObj.stdout);
			if ( cpObj.stderr ) console.log(cpObj.stderr);
		};
		return(cpObj.status);
	} catch (errObj5) {
		console.error( "!! ERROR in "+ __filename +"\nException-thrown/Error running command ["+ _command + "].  Exit code = "+ errObj5.code +"\n" + errObj5.toString());
		if ( _bExitOnFail ) process.exit( errObj5.code );
		else return(errObj5.code);
	}

	if (_bVerbose2) console.log( `${__filename} : DONE FINISHED command.  ${_command}` );
}

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

exports.executeSubModule = exports.executeSharingSTDOUT

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

// Decided to generalize the repeated code to try running ./pre.js ./pre.sh ./post.js ./post.sh
exports.runPrePostScript = 
function runPrePostScript( _runner, _fldr, _script ) {
	// const _script = './pre.js';
	// const _fldr = ".";
	// const runner = 'node';
	try {
		if (process.env.VERBOSE) console.log(__filename + ": checking if [" + _fldr+'/'+_script + "] exists or not.. .. ");
		fs.accessSync(_script, fs.constants.R_OK | fs.constants.X_OK);
		var preParams = process.argv;
		preParams.splice(0, 0, _script);
		EXECUTESHELLCMD.executeSharingSTDOUT( _fldr, _runner, preParams, false, process.env.VERBOSE, false, null);
	} catch (err8) { // a.k.a. if fs.accessSync throws
		if (process.env.VERBOSE) console.log(__filename + ": " + _fldr+'/'+_script + " does NOT EXIST.  So skipping quietly");
		if (process.env.VERBOSE) console.log(__filename + ": exception details: err8 = " + err8.toString());
	}
}

exports.runPreScripts = 	// Note the 'plural' in function-name - versus name of the above runPrePostScript function.
function runPreScripts() {	// Note the 'plural' in function-name - versus name of the above runPrePostScript function.
	exports.runPrePostScript( 'node', '.', 'pre.js' );
	exports.runPrePostScript( 'sh',   '.', 'pre.sh' );
}

exports.runPostScripts = 	// Note the 'plural' in function-name - versus name of the above runPrePostScript function.
function runPostScripts() {	// Note the 'plural' in function-name - versus name of the above runPrePostScript function.
	exports.runPrePostScript( 'node', '.', 'post.js' );
	exports.runPrePostScript( 'sh',   '.', 'post.sh' );
}

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

// exports.executionByExec =
// function( _newWorkingDir, _command, _cmdArgs, _quietlyRunCmd, _bVerbose2, _bExitOnFail, mycallback96 ) {
// 	const child99 = execFileSync( _command, _cmdArgs, ( errObj1, outStr1, errStr1) => {
// 		if (_bVerbose2) console.log( `${__filename} : in callback of execFileSync(...).  ${errObj1}` );
// 		if ( bChangedWorkingDir) process.chdir( originalCWD ); // why on earth would this throw?
// 		if(errObj1 != null) {
// 			console.log( `${__filename} : outStr1 = ${outStr1}  errStr1 = ${errStr1}`);
// 			if ( _bExitOnFail ) {
// 				console.error("\nPlease report issue with above output.\n");
// 				process.exit(91); // else fall-thru below.
// 				// if ( typeof(errObj1) != "string" )
// 				//		return mycallback96 (new Error(errObj1), null);
// 				// else
// 				if ( mycallback96 ) return mycallback96 (new Error(errObj1), null);
// 				else return errObj1.code;
// 			} else {
// 				if ( ! _quietlyRunCmd ) { // ok dump the output from command - onto the console
// 					var outStr1WPrefix = outStr1+'\n'; // add a blank line for visual effect (after prefixing  '> ' chars to each line of output)
// 					// prefix a '> ' for each line in outStr1.  Note, newlines are considered WHITESPACE
// 					function replStrFunc (match, p1, offset, string) { return '> ' + match; }
// 					outStr1WPrefix = outStr1WPrefix.replace(/^[^\n][^\n]*\n/mg, replStrFunc); // insert the prefix '> ' for each line in outStr1
// 					console.log( outStr1WPrefix );
// 				}
// 				if ( mycallback96 ) return mycallback96 (null, outStr1);
// 				else return errObj1.code;
// 			}
// 		} // outer IF-ELSE
// 	}); // callback of execFileSync
// };

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

exports.sleep = 
/**
 * CPU intensive solution to replicating the UNIX sleep() function call
 * @param {*} _seconds how long to sleep in SECONDS
 */
function sleep(_seconds) {
	// there is NO sleep() in Javascript
	var currentTime = new Date().getTime();
	while (currentTime + 1000 >= new Date().getTime()) {}
}


/**
 * Pass in a Map as 1st parameter, so I check boolean-value of _semaphoreMap.get(_semaphoreKey) .. periodically
 * @param {*} _semaphoreMap This should contain a key whose value is === _semaphoreKey
 * @param {*} _semaphoreKey 
 * @param {*} _seconds how long to sleep ** ** between ** ** checks of _semaphoreMap.get(_semaphoreKey)
 */
exports.wait = 
function wait( _semaphoreMap, _semaphoreKey, _seconds) {
	do { // How to sleep every SECOND and check..
		process.stdout.write('.');
		// there is NO sleep() in Javascript
		var currentTime = new Date().getTime();
		while (currentTime + (_secs*1000) >= new Date().getTime()) {}
	} while ( _semaphoreMap.get(_semaphoreKey) );
}

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

exports.showFileAttributes =
function showFileAttributes( _file ) {
	// ls -la "${_file}"
	// EXECUTE SHELL CMD.execute Sharing STDOUT ( "/tmp", 'ls', [_file], false, process.env.VERBOSE, false, null );
	const fstats = fs.statSync(_file);
	var mtime = new Date(fstats.mtime);
	var unixFilePermissions = '0' + (fstats.mode & parseInt('777', 8)).toString(8);
	console.log('> '+ _file +'\t'+ fstats.size +'\t'+ unixFilePermissions +'\t'+ fstats.uid +'\t'+ fstats.gid +'\t'+ mtime );
}

//---------------------------------------------------------
function myChdir(_newWorkingDir, originalCWD, _bVerbose2) {
	if (_newWorkingDir != originalCWD) {
		try {
			if (_bVerbose2)
				console.log(` ${__filename} : OLD Working Directory was: ${process.cwd()}`);
			process.chdir(_newWorkingDir);
			// ATTENTION: Backquote in log string - It's a template-literal per ECMAScript new standard
			if (_bVerbose2)
				console.log(` ${__filename} :NEW Working Directory is: ${process.cwd()}`);
			bChangedWorkingDir = true;
		} catch (errObj2) {
			console.error(`process.chdir: ${errObj2}`);
			process.exit(99); // too fatal an error.
		}
	}
	;
}

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

// fs.renameSync( "/tmp/a.txt", "/home/users/NewFileName.txt" ) <-- this never works, as it's 2-in-1 that Node.js CANNOT handle.
// So, it needs to be broken down into 2 steps: Rename into "SOURCE" folder, then move (using fs.renameSync(), which works fine).
// !!!!!!!!!!!!!!!!!!!! ATTENTION !!!!!!!!!!!!!!!!!!!!!
// this function will throw (by fs.renameSync());   So .. you better invoke this in a try-catch-block!
exports.renameAndMove =
function renameAndMove( _oldPath, _newPath ) {

	// !!!!!!!!!!!!!!!!!!!! ATTENTION !!!!!!!!!!!!!!!!!!!!!
	// this function will throw (by fs.renameSync());   So .. you better invoke this in a try-catch-block!

	// fs.renameSync( _oldPath, _newPath ); <<-- NEVER WORKED, when renaming + moving a file.
	const fileOldPathElems = _oldPath.split('/');
	fileOldPathElems.pop();
	var sourceFldrPath = "UNDEFINED JavascriptVariable 'sourceFldrPath' in "+ __filename;
	if ( fileOldPathElems.length <= 0 ) {
		sourceFldrPath = ".";
	} else {
		sourceFldrPath = fileOldPathElems.join('/') + "/.";
	}

	const fileNewPathElems = _newPath.split('/');
	const fileNewNameOnly = fileNewPathElems.pop();
	// const destFldrPath = fileNewPathElems.join('/') + "/.";

	const newFileNameInOldPath = sourceFldrPath +'/'+ fileNewNameOnly;

	if (process.env.VERBOSE) console.log( `about to RENAME ${_oldPath} to ${newFileNameInOldPath} ` );
	fs.renameSync( _oldPath, newFileNameInOldPath  );

	if (process.env.VERBOSE) console.log( `about to MOVE ${newFileNameInOldPath} to ${_newPath} ` );
	fs.renameSync( newFileNameInOldPath, _newPath );
}

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

// Decided to generalize the repeated code to try running ./pre.js ./pre.sh ./post.js ./post.sh
exports.checkIfExists = 
function checkIfExists(  _scriptOrFolder ) {
	try {
		if (process.env.VERBOSE) console.log(__filename + " (Script or Folder): checking if [" + _scriptOrFolder + "] exists or not.. .. ");
		fs.accessSync( _scriptOrFolder, fs.constants.R_OK | fs.constants.X_OK);
		return true;
	} catch (err12) { // a.k.a. if fs.accessSync throws
		if (process.env.VERBOSE) console.log(__filename + " (Script or Folder): [" + _scriptOrFolder + " does NOT EXIST.");
		if (process.env.VERBOSE) console.log(__filename + ": exception details: err8 = " + err12.toString());
		return false;
	}
}

//==========================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==========================================================

// DO NOT put anything below this line (basically, below the close-parenthesis in the previous line above)
//EoScript
//EoScript
//EoScript
//EoScript
//EoScript
