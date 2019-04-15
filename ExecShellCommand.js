#!/usr/bin/env node

const { spawnSync } = require('child_process');

// child_process exec() & execFile() - usef for callback, that is invoked when the child process terminates.
// Spawn typically is used to fire-n-forget processes.
// SpawnSync works best for me, especially with git which writes to stdout and stderr simultaneously.

//==========================
/** Switch to the FOLDER "cwd" (param #1)
 *	Exec "command" (param #2)
 *	cmdline arguments to pass to the "command" (param #3 is an array)
 *	true/false whether the OUTPUT of the "command" is dumped to console. (param #4)
 *	true/false whether THIS function is verbose.  Do NOT use the global process.env.VERBOSE. (param #5)
 *	true/false whether any failure should lead to an actual call to Process.EXIT(...) (param #6)
 *	On completion callback "mycallback99" (param #5)
 */
// This allows other modules to invoke the above function
exports.execution =
function( _newWorkingDir, _command, _cmdArgs, _quietlyRunCmd, _bVerbose2, _bExitOnFail, mycallback99 ) {

	var originalCWD = process.cwd();
	// var bChangedWorkingDir = false;

	// if ( _newWorkingDir != originalCWD ) {
	// 	try {
	// 		if (_bVerbose2) console.log( ` ${__filename} : OLD Working Directory was: ${process.cwd()}` );
	// 		process.chdir( _newWorkingDir );
	// 		// ATTENTION: Backquote in log string - It's a template-literal per ECMAScript new standard
	// 		if (_bVerbose2) console.log( ` ${__filename} :NEW Working Directory is: ${process.cwd()}` );
	// 		bChangedWorkingDir = true;
	// 	} catch (errMsg2) {
	// 		console.error(`process.chdir: ${errMsg2}`);
	// 		process.exit(99); // too fatal an error.  So, ignoring the value of _bExitOnFail
	// 	}
	// };

	// console.log( `${__filename} : verbose = ${_bVerbose2}`);
	if (_bVerbose2) console.log( `${__filename} : about to run command.  "${_command}" with cmdline arguments: ` + _cmdArgs.join(' ') );

	//----------------------
	try { // synchornous version of Javascript's child_process.execFile(...)
		const cpObj = spawnSync( _command, _cmdArgs, {'cwd': _newWorkingDir, 'timeout': 10000} );
		if ( ! _quietlyRunCmd ) {
			if (_bVerbose2) console.log( `${__filename} : about to dump output from command (code=${cpObj.status}))\n${cpObj.stdout}\n`+ cpObj.stderr +"\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );
			// ok dump the output from command - onto the console
			outStr1WPrefix = cpObj.stdout+cpObj.stderr; // add a blank line for visual effect (after prefixing  '> ' chars to each line of output)
			// prefix a '> ' for each line in outStr1.  Note, newlines are considered WHITESPACE
			function replStrFunc (match, p1, offset, string) { return '> ' + match; }
			outStr1WPrefix = outStr1WPrefix.replace(/^[^\n][^\n]*\n/mg, replStrFunc); // insert the prefix '> ' for each line in outStr1
			console.log( outStr1WPrefix );
		}
	} catch (errMsg4) {
		console.error("Error running command ["+ _command + "].  Exit code = "+ errMsg4.code +"\n" + errMsg4.toString());
		if ( _bExitOnFail ) process.exit( errMsg4.code );
	}

	// const child99 = execFileSync( _command, _cmdArgs, ( errObj1, outStr1, errStr1) => {
	// 			if (_bVerbose2) console.log( `${__filename} : in callback of execFileSync(...).  ${errObj1}` );
	// 			if ( bChangedWorkingDir) process.chdir( originalCWD ); // why on earth would this throw?
	// 			if(errObj1 != null) {
	// 				console.log( `${__filename} : outStr1 = ${outStr1}  errStr1 = ${errStr1}`);
	// 				if ( _bExitOnFail ) {
	// 					console.error("\nPlease report issue with above output.\n");
	// 					process.exit(91); // else fall-thru below.
	// 				// if ( typeof(errObj1) != "string" )
	// 				//		return mycallback99 (new Error(errObj1), null);
	// 			   	// else
	// 				if ( mycallback99 ) return mycallback99 (new Error(errObj1), null);
	// 				else return errObj1.code;
	// 			} else {
	// 				if ( ! _quietlyRunCmd ) { // ok dump the output from command - onto the console
	// 					outStr1WPrefix = outStr1+'\n'; // add a blank line for visual effect (after prefixing  '> ' chars to each line of output)
	// 					// prefix a '> ' for each line in outStr1.  Note, newlines are considered WHITESPACE
	// 					function replStrFunc (match, p1, offset, string) { return '> ' + match; }
	// 					outStr1WPrefix = outStr1WPrefix.replace(/^[^\n][^\n]*\n/mg, replStrFunc); // insert the prefix '> ' for each line in outStr1
	// 					console.log( outStr1WPrefix );
	// 				}
	// 				if ( mycallback99 ) return mycallback99 (null, outStr1);
	// 				else return errObj1.code;
	// 	    		}
	// 			} // outer IF-ELSE
	// }); // EXECCMD

	if (_bVerbose2) console.log( `${__filename} : DONE FINISHED command.  ${_command}` );

	// to be safe.. let's repeat 'chdir()' again here...
	// if ( bChangedWorkingDir ) process.chdir( originalCWD ); // why on earth would this throw?

}
// DO NOT put anything below this line (basically, below the close-parenthesis in the previous line above)
//EoScript