#!/usr/bin/env node

const { execFile } = require('child_process');

//==========================
/*	Switch to the FOLDER "cwd" (param #1)
 *	Exec "command" (param #2)
 *	On completion whether zero/non-zero exit-code.. callback "cb" (param #3)
 */
var execution = function( _newWorkingDir, _command, _cmdArgs, mycallback ) {

	var originalCWD = process.cwd();
	var bChangedWorkingDir = false;

	if ( _newWorkingDir != originalCWD ) {
		try {
			if (process.env.VERBOSE) console.log( ` ${__filename} : OLD Working Directory was: ${process.cwd()}` );
			process.chdir( _newWorkingDir );
			// ATTENTION: Backquote in log string - It's a template-literal per ECMAScript new standard
			if (process.env.VERBOSE) console.log( ` ${__filename} :NEW Working Directory is: ${process.cwd()}` );
			bChangedWorkingDir = true;
		} catch (errMsg2) {
			console.error(`process.chdir: ${errMsg2}`);
			process.exit(99);
		}
	};

	// if (process.env.VERBOSE) console.log( `${__filename} : about to run command.  ${_command}` );

	//----------------------
	// const child1 = execFile("/bin/ls", ["/tmp"], { cwd: "/tmp", shell: false, timeout: 50 }, 
	// 		(error, stdout, stderr) => { console.log(stdout); console.log(stderr); } );

	const child2 = execFile( _command, _cmdArgs, ( errObj1, outStr1, errStr1) => {
				console.log( `${__filename} : verbose = ${process.env.VERBOSE}`);
				console.log( `${__filename} : outStr1 = ${outStr1}  errStr1 = ${errStr1}`);
				if (process.env.VERBOSE) console.log( `${__filename} : in callback after running command.  ${errObj1}` );
				if ( bChangedWorkingDir) process.chdir( originalCWD ); // why on earth would this throw?
				if(errObj1 != null) {
					return mycallback1 (new Error(errObj1), null);
				} else {
					if ( typeof(errObj1) != "string" ) {
						return mycallback1 (new Error(errObj1), null);
				   	}else{
						return mycallback1 (null, outStr1);
		    		}
				} // outer IF-ELSE
	    } // function _errObj _outStr _errStr
	); // EXECCMD


	if (process.env.VERBOSE) console.log( `${__filename} : DONE FINISHED command.  ${_command}` );

	// to be safe.. let's repeat 'chdir()' again here...
	if ( bChangedWorkingDir ) process.chdir( originalCWD ); // why on earth would this throw?
}

exports.execution = execution;

//EoScript
