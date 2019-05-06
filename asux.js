#!/usr/bin/env node

var CmdLine = require('commander'); // https://github.com/tj/commander.js/
var os = require('os');			// https://nodejs.org/api/os.html
var PATH = require('path'); // to help process the script-file details.
var fs = require("fs"); 		// https://nodejs.org/api/fs.html#fs_fs_accesssync_path_mode

//--------------------------------------
// This is the Node.JS script within the same directory - to make it simple to run an external command
var EXECUTESHELLCMD = require( __dirname + "/ExecShellCommand.js");

var INITIAL_CWD = process.cwd(); // just in case I mistakenly process.chdir() somewhere below.
var COMMAND = "unknown"; // will be set based on what the user enters on the commandline.

//======================================
CmdLine
	.version('1.0', '-v, --version')
	.usage('[options] <commands ...>')
	.option('--verbose', 'A value that can be increased by repeating', 0)
	.option('--properties [propsFile]', 'A JSON file containing Key-value pairs', 0)
	;

//---------------
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

//--------------------------
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
	console.log("Yeah.  Going verbose " + this.verbose);
  process.env.VERBOSE = this.verbose;
});

CmdLine.on('option:properties', function () {
	console.log("Reading properties file [" + this.properties +"]");
	// read the file and store it in GLOBAL variable ;
	PROPERTIES = require ( this.properties );
});

//---------------------------------------
CmdLine.on('command:yaml', function () {
	if (process.env.VERBOSE) console.log("Yeah.  processing YAML command");
	COMMAND = 'yaml';
	sendArgs2SubModule_Cmdline();
});

CmdLine.on('command:aws', function () {
	if (process.env.VERBOSE) console.log("Yeah.  processing Amazon-AWS command");
	COMMAND = 'aws';
	// sendArgs2SubModule_AWS();
});

// Like the 'default' in a switch statement.. .. After all of the above "on" callbacks **FAIL** to trigger, we'll end up here.
// If we end up here, then .. Show error about unknown command
CmdLine.on('command:*', function (_cmd) {
	console.error("Invalid command: "+ _cmd +"\nSee --help for a list of available commands.\n"+ process.argv.join(' '));
	process.exit(1);
});

//==========================
CmdLine.parse(process.argv);

//============================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//============================================================

function sendArgs2SubModule_Cmdline() {

	if ( __dirname != process.cwd()  ) {
	if (process.env.VERBOSE) console.log("you **WERE** in the directory: '%s'", process.cwd() );
	// process.chdir(  __dirname );
	// COMMENT: NO LONGER CORRECT --> Must switch to root of org.ASUX project working folder - to fetch sub-projects
	// if (process.env.VERBOSE) console.log("switched to directory: '%s'", process.cwd());
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
EXECUTESHELLCMD.executionPiped ( __dirname, 'git', ['pull', '--quiet'], true, process.env.VERBOSE, true, null);

//Create '/tmp'.   FYI: mkdirSync() Returns undefined always.
// At least one asux.js script runs commands like mvn from /tmp folder.
const tmpdist = '/tmp';
try {
	if (process.env.VERBOSE) console.log( `checking if ${tmpdist} exists or not.. .. ` );
	fs.accessSync( tmpdist, fs.constants.R_OK | fs.constants.X_OK );
} catch (err8) { // a.k.a. if fs.accessSync throws
	try {
		if (process.env.VERBOSE) console.log( `mkdir ${tmpdist} .. .. ` );
		fs.mkdirSync ( tmpdist,  {recursive: true, mode: 0o755} ); // 
	} catch (err8) { // a.k.a. if fs.mkdirSync throws
		console.error( __filename +": Internal failure, creating the folder ["+ tmpdist +"]\n"+ err8.toString());
		process.exit(11);
	}
} // try-catch err8

//--------------------
if (process.env.VERBOSE) console.log( 'about to process sub-projects of org.ASUX' );

const DIR_orgASUXcmdline = __dirname + '/cmdline';
const DIR_orgASUXcmdline_Downloaded = __dirname + '/'+ PROJNAME;
try {
		if (process.env.VERBOSE) console.log( `checking if ${DIR_orgASUXcmdline} exists or not.. .. ` );
		fs.accessSync( DIR_orgASUXcmdline, fs.constants.R_OK | fs.constants.X_OK );

		// ok!  ./cmdline folder exists
		if (process.env.VERBOSE) console.log( `${DIR_orgASUXcmdline} ALREADY Exists` );

		// No issues accessing the folder
		// Let's refresh the .cmdline subfolder - by passing ./cmdline as 1st parameter, so git pull happens inside it.
		// I'd rather do it here,  instead of having each sub-project/sub-folder do it by itself.
		EXECUTESHELLCMD.executeSharingSTDOUT(  DIR_orgASUXcmdline, 'git', ['pull', '--quiet'], true, process.env.VERBOSE, true, null );

} catch(err2) { // err2.code === 'ENOENT')

		console.error( 'Hmmmm.   1st time ever!?   Let me complete initial-setup (1 minute)...\n');
		EXECUTESHELLCMD.sleep(5);

		if (process.env.VERBOSE) console.log( `${DIR_orgASUXcmdline} does Not exist. So.. pulling from remote Git repo. ` );

		// var gitpullcmdArgs = ['clone', '--quiet', `https://github.com/${ORGNAME}/${PROJNAME}`];
		var gitpullcmdArgs = ['clone', `https://github.com/${ORGNAME}/${PROJNAME}`];
		console.log( 'git '+ gitpullcmdArgs.join(' ') );

		// use git to get the code for the ./cmdline sub-folder/sub-project
		const retCode = EXECUTESHELLCMD.executeSharingSTDOUT ( __dirname, 'git', gitpullcmdArgs, false, process.env.VERBOSE, true, null );
		if(retCode != 0){
			// git pull FAILED. Now try to write to an ERROR file, so user can use it to report an issue/bug
			console.error( __filename +": Internal error: Please contact the project owner, with the above lines\n\n");
			process.exit(12);
		} // if retCode

		// about to RENAME org.ASUX.cmdline to just cmdline.   FYI: renameSync Returns undefined ALWAYS.
		if (process.env.VERBOSE) console.log( `about to RENAME folder ${PROJNAME} to just ${DIR_orgASUXcmdline} ` );
		try {
			fs.renameSync( DIR_orgASUXcmdline_Downloaded, DIR_orgASUXcmdline);
		} catch (err6) { // a.k.a. if fs.mkdirSync throws
			console.error( __filename +": Internal failure, renaming the folder ["+ PROJNAME +"]\n"+ err6.toString());
			process.exit(12);
		} // try-catch err8

} // try-catch err2

	//--------------------


	//decison made: Each subfolder of org.ASUX (like org.ASUX.cmdline) will be a standalone project ..
	// .. as in: subfolder/asux.js is EXPECTING to see cmdline-arguments **as if** it were entered by user on shell-prompt



	//--------------------
	// pre-scripts (Before running ./cmdline/asux.js)
	EXECUTESHELLCMD.runPreScripts(); // ignore any exit code from these PRE-scripts

	//--------------------------------------------------------
	// In Unix shell, If there are spaces inside the variables, then "$@" retains the spaces, while "$*" does not
	// The following lines of code are the JS-quivalent of shell's      ./cmdline/asux $@
	// For starters, Get rid of 'node' and 'asux.js' via slice(2)
	var prms = [];
	for (var ix in process.argv) {
    if ( process.argv[ix].match('.*node(.exe)?$') ) continue; // get rid of node.js  or  node.exe (on windows)
		if ( ix < 2 ) continue; // For starters, Get rid of 'node' and 'asux.js'
		if ( process.argv[ix] == COMMAND ) continue; // Skip 'yaml' or 'aws' or .. ..
		prms.push( process.argv[ix]);
	}
	prms.splice( 0, 0, DIR_orgASUXcmdline +'/asux.js' ); // insert ./asux.js as the 1st cmdline parameter to node.js
	if (process.env.VERBOSE) { console.log( `${__filename} : running Node.JS with cmdline-arguments:` + prms.join(' ') ); }

	process.env.PARENTPROJFLDR=__dirname; // for use by cmdline/asux.js .. so it know where this asux.js is.

	process.exitCode =
			EXECUTESHELLCMD.executeSubModule(  INITIAL_CWD, 'node', prms, false, process.env.VERBOSE, false, null );

			// Keeping code around .. .. In case I wanted to run the submodule via .. JS require()
			// var runOrgASUXCmdLine = require( __dirname +"/"+ subdir + "/asux.js");
			// runOrgASUXCmdLine.functionName( prms, callBackFn( __dirname, err11, response ) {
			//		if(!err11){ console.log(response); }else { console.error(err11); process.exit(err11.code); }
			// });

	//--------------------
	EXECUTESHELLCMD.runPostScripts(); // ignore any exit code from these Post-scripts

	// The Node.js process will exit on its own if there is no additional work pending in the event loop.
	// The process.exitCode property can be set to tell the process which exit code to use when the process exits gracefully.

} // end function sendArgs2CmdlineModule

//============================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//============================================================

process.exitCode = 0;

//EoScript