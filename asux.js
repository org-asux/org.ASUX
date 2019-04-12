#!/usr/bin/env node

var CmdLine = require('commander');
var colors = require('colors');
var os = require('os');
var PATH = require('path'); // to help process the script-file details.
var fs = require("fs");
var EXECUTESHELLCMD = require( __dirname + "/ExecShellCommand.js");

//==========================
CmdLine
	.version('1.0', '-v, --version')
	.usage('[options] <commands ...>')
	.option('--verbose', 'A value that can be increased by repeating', 0)
	;

//==========================
/* attach options to a command */
/* if a command does NOT define an action (see .action invocation), then the options are NOT validated */
/* For Git-like submodule commands.. ..
 *	When .command() is invoked with a description argument, no .action(callback) should be called to handle sub-commands.
 *	Otherwise there will be an error.
 *	By avoiding .action(), you tell commander that you're going to use separate executables for sub-commands, much like git(1) and other popular tools.
 *	The commander will try to search the executables in the directory of the entry script (if this file is TopCmd.js) for names like:- TopCmd-install.js TopCmd-search.js
 *	Specifying true for opts.noHelp (see noHelp)  will remove the subcommand from the generated help output.
*/

CmdLine
.command('yaml', 'read/query/list/replace/delete content from YAML files', { isDefault: false, noHelp: false } )
.command('aws', 'a large family of commands to interact with AWS components like CloudFormation, API-Gateway & Lambda functions', {isDefault: false, noHelp: false} )
	;

//==========================
// Custom HELP output .. must be before .parse() since node's emit() is immediate

CmdLine.on('--help', function(){
  console.log('')
  console.log('Examples:');
  console.log('  $ %s --help', __filename);
  console.log('  $ %s --version', __filename);
  console.log('  $ %s --verbose yaml .. ..', __filename);
  console.log('  $ %s --no-verbose aws cfn .. ..', __filename);
});

//==========================
/* execute custom actions by listening to command and option events.
 */

CmdLine.on('option:verbose', function () {
	// console.log("Yeah.  Going verbose" + this.verbose);
  process.env.VERBOSE = this.verbose;
});

CmdLine.on('command:yaml', function () {
	if (process.env.VERBOSE) console.log("Yeah.  processing YAML command");
	sendArgs2CmdlineModule();
});

CmdLine.on('command:aws', function () {
	if (process.env.VERBOSE) console.log("Yeah.  processing Amazon-AWS command");
});

// Like the 'default' in a switch statement.. .. After all of the above "on" callbacks **FAIL** to trigger, we'll end up here.
// If we end up here, then .. Show error about unknown command
CmdLine.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', CmdLine.args.join(' '));
  process.exit(1);
});

//==========================
CmdLine.parse(process.argv);

//==========================

function sendArgs2CmdlineModule() {
//-------------------
if ( __dirname != process.cwd()  ) {
	if (process.env.VERBOSE) console.log("you **WERE** in the directory: '%s'", process.cwd() );
	process.chdir(  __dirname );
	// COMMENT: Must switch to root of org.ASUX project working folder - to fetch sub-projects
	if (process.env.VERBOSE) console.log("switched to directory: '%s'", process.cwd());
}else{
	if (process.env.VERBOSE) console.log("You are running from where this Node.JS Script is.  Nice! %s", __dirname );
}


//-------------------
var ORGNAME="org-asux";
var PROJNAME="org.ASUX.cmdline";
var OUTPFILE=os.tmpdir() + "/org.ASUX-setup-output-" + process.pid + ".txt";
if (process.env.VERBOSE) console.log( 'OUTPFILE="'+OUTPFILE+'"' );

// Dont care if this command fails
// git pull  >/dev/null 2>&1
if (process.env.VERBOSE) console.log( ` OLD Working Directory was: ${process.cwd()}` );
EXECUTESHELLCMD.execution ( __dirname, 'git', ['pull'], ( err1, response ) => {
	console.log(response); console.err(err1);
	if(!err1){ console.log(response); }else { console.err(err1); }
});

//--------------------
if (process.env.VERBOSE) console.log( 'about to process sub-projects of org.ASUX' );

fs.access( './cmdline', function(err2) {
	if (process.env.VERBOSE) console.log( "checking if ./cmdline exists or not.. .. " );
	if (err2 && err2.code === 'ENOENT') {
		if (process.env.VERBOSE) console.log( "./cmdline does Not exist. So.. pulling from remote Git repo. " );
		fs.mkdir(myDir); //Create dir in case not found
    console.log( 'Hmmmm.   1st time ever!?   Let me complete initial-setup (1min)...\n\n');
	  var gitpullcmdArgs = ['clone', '--quiet', `https://github.com/${ORGNAME}/${PROJNAME}`];
	  console.log( 'git '+ gitpullcmd.join(' ') );

		EXECUTESHELLCMD.execution ( __dirname, 'git', gitpullcmdArgs, function( err3, response ) {
			if(!err3){ console.log(response);
			}else {
				fs.writeFile( OUTPFILE,  err4, (err5) => {
					if (err5) {
					    console.error(`Internal error: Please contact the project owner, that: Unable to write to '$OUTPFILE'`);
					} else {
					    /* console.log("Successfully wrote 2 File."); */
					    console.error(`Internal error: Please contact the project owner, by uploading the contents of the file '$OUTPFILE'`);
					} // if err5
			  } // callback within fs.writeFile
				); // fs.writeFile
			} // if-else !err3
    });
//!!!!!!!!!!!!!!!!!!!!!!!!! Make a function that allows EVERY EXEC-CMD to benefit

		if (process.env.VERBOSE) console.log( "about to RENAME org.ASUX.cmdline to just cmdline " );

	  fs.rename( oldFN, newFN, function (err6) {
			if(!err6){ if (process.env.VERBOSE) console.log( `successfully renamed $oldFN --> $newFN` ); }else { console.err(err6); }
	  });
	  // EXECUTESHELLCMD.result( __dirname, `mv ${PROJNAME} cmdline`, function( err6, response ) {
	  //	if(!err6){ if (process.env.VERBOSE) console.log(response); }else { console.err(err6); }
	  // });

	}else{ // ok!  ./cmdline folder exists
		if (process.env.VERBOSE) console.log( "./cmdline ALREADY Exists" );
		if (err2 && err2.code != 'ENOENT') { // well it exist and we have an error code!
			console.error( 'Internal error: Please contact the project owner, with this detail about "./cmdline" :%s', $err2);
			process.exit(21);
		} else { // No issues accessing the folder
			EXECUTESHELLCMD.execution(  "./cmdline", 'git', ['pull', '--quiet'], function( err8, response ) {
				console.log(response); console.err(err8);
			   if(!err8){ if (process.env.VERBOSE) console.log(response); } else { console.err(err8);  process.exit(21); }
			});
		} // INNER-if-else err2 & err2.code
	} // OUTER-if-else err2 & err2.code
}); // fs.access

//--------------------
// If there are spaces inside the variables, then "$@" retains the spaces, while "$*" does not

// ./cmdline/asux $@
// var runOrgASUXCmdLine = require( __dirname + "/cmdline/asux.js");
// runOrgASUXCmdLine.functionName( params, callBackFn( __dirname, err11, response ) {
//	if(!err11){ console.log(response); }else { console.err(err11); process.exit(err11.code); }
//});

// The Node.js process will exit on its own if there is no additional work pending in the event loop.
// The process.exitCode property can be set to tell the process which exit code to use when the process exits gracefully.

} // end function sendArgs2CmdlineModule

sendArgs2CmdlineModule();

process.exitCode = 0;

//EoScript