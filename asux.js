#!/usr/bin/env node

var CmdLine = require('commander');
var os = require('os');
var PATH = require('path'); // to help process the script-file details.
var fs = require("fs");

// This is the Node.JS script within the same directory - to make it simple to run an external command
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
	sendArgs2SubModule_Cmdline();
});

CmdLine.on('command:aws', function () {
	if (process.env.VERBOSE) console.log("Yeah.  processing Amazon-AWS command");
	// sendArgs2SubModule_AWS();
});

// Like the 'default' in a switch statement.. .. After all of the above "on" callbacks **FAIL** to trigger, we'll end up here.
// If we end up here, then .. Show error about unknown command
CmdLine.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', CmdLine.args.join(' '));
  process.exit(1);
});

//==========================
CmdLine.parse(process.argv);

//============================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//============================================================

function sendArgs2SubModule_Cmdline() {
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
EXECUTESHELLCMD.execution ( __dirname, 'git', ['pull'], true, process.env.VERBOSE, true, null);

//--------------------
if (process.env.VERBOSE) console.log( 'about to process sub-projects of org.ASUX' );

const subdir = 'cmdline';
fs.access( subdir, function(err2) {
	if (process.env.VERBOSE) console.log( `checking if ${subdir} exists or not.. .. ` );
	if (err2 && err2.code === 'ENOENT') {
		if (process.env.VERBOSE) console.log( `${subdir} does Not exist. So.. pulling from remote Git repo. ` );
		fs.mkdir(subdir,  //Create dir in case not found.
				{recursive: true}, (err8)=>{ if(err8) { console.err(err8.toString()); process.exit(31); } } ); 
    console.error( 'Hmmmm.   1st time ever!?   Let me complete initial-setup (1min)...\n');
//	  var gitpullcmdArgs = ['clone', '--quiet', `https://github.com/${ORGNAME}/${PROJNAME}`];
	  var gitpullcmdArgs = ['clone', `https://github.com/${ORGNAME}/${PROJNAME}`];
		console.log( 'git '+ gitpullcmdArgs.join(' ') );

		// use git to get the code for the ./cmdline sub-folder/sub-project
		EXECUTESHELLCMD.execution ( __dirname, 'git', gitpullcmdArgs, false, process.env.VERBOSE, true, function( err3, response ) {
			if(!err3){ console.log(response);
			}else { // git pull FAILED. Now try to write to an ERROR file, so user can use it to report an issue/bug
				fs.writeFile( OUTPFILE,  err4, (err5) => {
					if (err5) { console.error(`Internal error: Please contact the project owner, that: Unable to write to '$OUTPFILE'`);
					} else { console.error(`Internal error: Please contact the project owner, by uploading the contents of the file '$OUTPFILE'`);
					} // if err5
			  } // callback within fs.writeFile
				); // fs.writeFile
			} // if-else !err3
    });
//!!!!!!!!!!!!!!!!!!!!!!!!! Make a function that allows EVERY EXEC-CMD to benefit

		// about to RENAME org.ASUX.cmdline to just cmdline
		if (process.env.VERBOSE) console.log( `about to RENAME folder ${PROJNAME} to just ${subdir} ` );

	  fs.rename( PROJNAME, subdir, function (err6) {
			if(!err6){ console.log( `renamed ${PROJNAME} --> ${subdir}` ); }else { console.err(err6); }
	  });

	}else{ // ok!  ./cmdline folder exists
		if (process.env.VERBOSE) console.log( `${subdir} ALREADY Exists` );
		if (err2 && err2.code != 'ENOENT') { // well it exist and we have an error code!
			console.error( 'Internal error: Please contact the project owner, with this detail about "${subdir}" :%s', $err2.toString());
			process.exit(21);
		} else { // No issues accessing the folder
			// Let's refresh the .cmdline subfolder - by passing ./cmdline as 1st parameter, so git pull happens inside it.
			// I'd rather do it here,  instead of having each sub-project/sub-folder do it by itself.
			EXECUTESHELLCMD.execution(  subdir, 'git', ['pull', '--quiet'], false, process.env.VERBOSE, true, null );
		} // INNER-if-else err2 & err2.code
	} // OUTER-if-else err2 & err2.code

	//--------------------



	
	//decison made: Each subfolder of org.ASUX (like org.ASUX.cmdline) will be a standalone project ..
	// .. as in: subfolder/asux.js is EXPECTING to see cmdline-arguments **as if** it were entered by user on shell-prompt



	// In Unix shell, If there are spaces inside the variables, then "$@" retains the spaces, while "$*" does not
	// equivalent of    ./cmdline/asux $@
	var prms = process.argv.slice(3); // get rid of 'node' '--verbose' and 'asux.js'.
	prms.splice(0,0, './asux.js' );
	if ( process.env.VERBOSE ) prms.splice(0,0, '--verbose' );
	EXECUTESHELLCMD.execution(  subdir, 'node', prms, false, process.env.VERBOSE, false, null );

			// var runOrgASUXCmdLine = require( __dirname +"/"+ subdir + "/asux.js");
			// runOrgASUXCmdLine.functionName( prms, callBackFn( __dirname, err11, response ) {
			// 	if(!err11){ console.log(response); }else { console.err(err11); process.exit(err11.code); }
			// });

}); // fs.access

// The Node.js process will exit on its own if there is no additional work pending in the event loop.
// The process.exitCode property can be set to tell the process which exit code to use when the process exits gracefully.

} // end function sendArgs2CmdlineModule

//============================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//============================================================

process.exitCode = 0;

//EoScript