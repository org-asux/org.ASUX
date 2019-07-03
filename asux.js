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

var TMPDIR="/tmp";  // i do NOT like os.tmpdir().. as I canNOT MANUALLY find files I create there .
var ORGNAME="org-asux";
var OUTPFILE=TMPDIR + "/org.ASUX-setup-output-" + process.pid + ".txt";
if (process.env.VERBOSE) console.log( 'OUTPFILE="'+OUTPFILE+'"' );

var LASTRUNTIMESTAMP_FILEPATH_PREFIX = TMPDIR + "/org.ASUX-asux.js-lastRunTimeStamp"

var bLastRunLongAgo = true;

//--------------------------------------
var PROJNAME_cmdline="org.ASUX.cmdline";
const DIR_orgASUXcmdline = __dirname + '/cmdline';
const DIR_orgASUXcmdline_Downloaded = __dirname + '/'+ PROJNAME_cmdline;

var PROJNAME_AWS="org.ASUX.AWS";
const DIR_orgASUXAWS = __dirname + '/AWS';
const DIR_orgASUXAWS_Downloaded = __dirname + '/'+ PROJNAME_AWS;

var PROJNAME_AWSCFN="org.ASUX.AWS.CFN";
const DIR_orgASUXAWSCFN = __dirname + '/AWS/CFN';
const DIR_orgASUXAWSCFN_Downloaded = __dirname + '/'+ PROJNAME_AWSCFN;

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
.command('aws.cfn', 'Create, Generate AWS CloudFormation-templates', {isDefault: false, noHelp: false} )
.command('install', 'if you are installing / re-installing', { isDefault: false, noHelp: true } )
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
CmdLine.on('command:install', function () {
	if (process.env.VERBOSE) console.log("Yeah.  helping 'install' script verify proper installation");
	COMMAND = 'install';
	verifyInstall();
});

//---------------------------------------
CmdLine.on('command:yaml', function () {
	if (process.env.VERBOSE) console.log("Yeah.  processing YAML command");
	COMMAND = 'yaml';
	verifyInstall();
	sendArgs2SubModule( DIR_orgASUXcmdline );
});

CmdLine.on('command:aws', function () {
	if (process.env.VERBOSE) console.log("Yeah.  processing Amazon-AWS command");
	COMMAND = 'aws';
	verifyInstall();
	sendArgs2SubModule( DIR_orgASUXAWS );
});

CmdLine.on('command:aws.cfn', function () {
	if (process.env.VERBOSE) console.log("Yeah.  processing Amazon-AWS-CloudFormation command");
	COMMAND = 'aws.cfn';
	verifyInstall();
	sendArgs2SubModule( DIR_orgASUXAWSCFN );
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

function verifyInstall() {
	runGitPullAll();
	createAndAccessSlashTmp();
	checkIfAllSubProjectsExist();
}

function runGitPullAll() {
	runGitPull( PROJNAME_cmdline,	DIR_orgASUXcmdline	);
	runGitPull( PROJNAME_AWS,		DIR_orgASUXAWS		);
	runGitPull( PROJNAME_AWSCFN,	DIR_orgASUXAWSCFN	);
}

// !!!!!!!! ATTENTION !!!!!!!!!!!! this function gitpull() only will work if the sub-project has been checkedout/pulled once already.
// Much of this function's logic is to _ONLY_ Run 'git pull' at most 1/day on this project as well as sub-projects like org.ASUX.cmdline
function runGitPull( _PROJNAME, _DIR_orgASUXSubProject ) {

		// the following code allows me to check when was the last time this script was run.
		// if more than one day, set a flag.. so that 'daily-update' activities can be kicked off downstream.
		const currTimeStamp = Date.now() / 1000;
		const oneDayInSeconds = 24*3600;
		var oneDayLater = 0;
		var lastRunTimeInSecs = 99999999999999;
		const LASTRUNTIMESTAMP_FILEPATH = LASTRUNTIMESTAMP_FILEPATH_PREFIX +'-'+ _PROJNAME +'.txt';
		if (process.env.VERBOSE) console.log( "\nLASTRUNTIMESTAMP_FILEPATH='"+LASTRUNTIMESTAMP_FILEPATH+'"' );
		try {
			if (process.env.VERBOSE) console.log( `checking if ${LASTRUNTIMESTAMP_FILEPATH} exists or not.. .. ` );
			const timeStampStrBuf = fs.readFileSync( LASTRUNTIMESTAMP_FILEPATH ); // must contain String-form of a timestamp
			lastRunTimeInSecs = Number( timeStampStrBuf.toString() );
			if (process.env.VERBOSE) console.log( __filename +" file contents of LASTRUNTIMESTAMP_FILEPATH: ["+ LASTRUNTIMESTAMP_FILEPATH +"] = ["+ timeStampStrBuf +"]");
			if ( isNaN( lastRunTimeInSecs ) ) {
					console.error("Serious Internal-Error! Failed to determine the 'last-run-timestamp' (it is contents of file "+ LASTRUNTIMESTAMP_FILEPATH +").\n Very likely that file does NOT contain time-in-seconds content.");
					process.exit(1);
			}
			if (process.env.VERBOSE) console.log( " oneDayInSeconds="+ oneDayInSeconds );
			oneDayLater = lastRunTimeInSecs + oneDayInSeconds;
			if (process.env.VERBOSE) console.log( " lastRunTimeInSecs="+ lastRunTimeInSecs +" oneDayLater="+ oneDayLater );
			bLastRunLongAgo = ( currTimeStamp > oneDayLater );
			if (process.env.VERBOSE) console.log( "currTimeStamp= "+ currTimeStamp +" lastRunTimeInSecs="+ lastRunTimeInSecs +" oneDayLater="+ oneDayLater +".   So, bLastRunLongAgo="+ bLastRunLongAgo );
			if (process.env.VERBOSE) console.log( "you last ran this script "+ (currTimeStamp - lastRunTimeInSecs) +" seconds ago!" );
		} catch (err33) { // a.k.a. if fs.readFileSync throws err13.code === 'ENOENT' || 'EISDIR')
			// !!!!!!!!!! ATTENTION !!!!!!!!!! You'll get this exception, the 1st time this project is run.. and after EVERY REBOOT.   so.. .. be careful showing the following error-message to the end-user
			if (process.env.VERBOSE) console.error( __filename +"Non-Fatal Internal ERROR: failed to read LASTRUNTIMESTAMP_FILEPATH: ["+ LASTRUNTIMESTAMP_FILEPATH +"]\n"+ err33);
		}; // try-catch of fs.readFileSync ( LASTRUNTIMESTAMP_FILEPATH .. )

		//-------------------
		//-------------------
		// Let's refresh the .cmdline subfolder - by passing ./cmdline as 1st parameter, so git pull happens inside it.
		// I'd rather do it here,  instead of having each sub-project/sub-folder do it by itself.
		// But .. .. Dont care if git command(s) fail
		// git pull  >/dev/null 2>&1
		if (process.env.VERBOSE) console.log( ` OLD Working Directory was: ${process.cwd()}` );
		if ( bLastRunLongAgo ) {
				// 1st:  check if this project (topmost: org.ASUX.git) is updated.
				EXECUTESHELLCMD.executionPiped ( __dirname, 'git', ['pull', '--quiet'], true, process.env.VERBOSE, true, process.env);
				// 2nd:  Now check if the subproject is updated.
				EXECUTESHELLCMD.executeSharingSTDOUT(  _DIR_orgASUXSubProject, 'git', ['pull', '--quiet'], true, process.env.VERBOSE, true, process.env );

				try {
					fs.writeFileSync( LASTRUNTIMESTAMP_FILEPATH, currTimeStamp, { mode: 0o755 });
				} catch (err33) { // a.k.a. if fs.writeFileSync throws err13.code === 'ENOENT' || 'EISDIR')
					console.error( __filename +"Internal error: failed to WRITE "+ currTimeStamp +" to File @ ["+ LASTRUNTIMESTAMP_FILEPATH +"]\n"+ err33);
				}; // try-catch of fs.readFileSync ( LASTRUNTIMESTAMP_FILEPATH .. )
		} else {
				if (process.env.VERBOSE) console.log( "skipping git pull -quiet for "+ __dirname +".. .. as it was run recently "+ (currTimeStamp - lastRunTimeInSecs) +" seconds ago." );
		}


	}

//============================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//============================================================

function createAndAccessSlashTmp() {
	//Create '/tmp'.   FYI: mkdirSync() Returns undefined always.
	// At least one asux.js script runs commands like mvn from /tmp folder.
	try {
			if (process.env.VERBOSE) console.log( `\nchecking if ${TMPDIR} exists or not.. .. ` );
			fs.accessSync( TMPDIR, fs.constants.R_OK | fs.constants.X_OK );
	} catch (err8) { // a.k.a. if fs.accessSync throws
			try {
				if (process.env.VERBOSE) console.log( `mkdir ${TMPDIR} .. .. ` );
				fs.mkdirSync ( TMPDIR,  {recursive: true, mode: 0o755} ); // 
			} catch (err8) { // a.k.a. if fs.mkdirSync throws
				console.error( __filename +": Internal failure, creating the folder ["+ TMPDIR +"]\n"+ err8.toString());
				process.exit(11);
			}
	} // try-catch err8
}

//============================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//============================================================

function checkIfAllSubProjectsExist() {
	checkIfSubProjectExists( PROJNAME_cmdline,	DIR_orgASUXcmdline,		DIR_orgASUXcmdline_Downloaded	);
	checkIfSubProjectExists( PROJNAME_AWS,		DIR_orgASUXAWS,			DIR_orgASUXAWS_Downloaded		);
	checkIfSubProjectExists( PROJNAME_AWSCFN,	DIR_orgASUXAWSCFN,		DIR_orgASUXAWSCFN_Downloaded	);
}

//============================================================
function checkIfSubProjectExists( _PROJNAME, _DIR_orgASUXSubProject, _DIR_orgASUXSubProject_Downloaded )
{
	if (process.env.VERBOSE) console.log( 'about to process sub-projects of org.ASUX' );

	try {
			if (process.env.VERBOSE) console.log( `checking if ${_DIR_orgASUXSubProject} exists or not.. .. ` );
			fs.accessSync( _DIR_orgASUXSubProject, fs.constants.R_OK | fs.constants.X_OK );

			// ok!  ./cmdline folder exists
			if (process.env.VERBOSE) console.log( `${_DIR_orgASUXSubProject} ALREADY Exists` );

	} catch(err2) { // err2.code === 'ENOENT')

			console.error( 'Hmmmm.   1st time ever!?   Let me complete initial-setup (1 minute)...\n' );
			EXECUTESHELLCMD.sleep(5);

			if (process.env.VERBOSE) console.log( "Folder"+ _DIR_orgASUXSubProject +" does Not exist. So.. pulling from remote Git repo." );
			// !!!!!!!!!!!!! ATTENTION !!!!!!!!!!!!!! The folder for Sub-Project does Not exist.
			// So, we __CANNOT__ take advantage of runGitPull() function above.

			// var gitpullcmdArgs = ['clone', '--quiet', `https://github.com/${ORGNAME}/${_PROJNAME}`];
			var gitpullcmdArgs = ['clone', `https://github.com/${ORGNAME}/${_PROJNAME}`];
			console.log( 'git '+ gitpullcmdArgs.join(' ') );

			// use git to get the code for the ./cmdline sub-folder/sub-project
			const retCode = EXECUTESHELLCMD.executeSharingSTDOUT ( __dirname, 'git', gitpullcmdArgs, false, process.env.VERBOSE, true, process.env );
			if(retCode != 0){
				// git pull FAILED. Now try to write to an ERROR file, so user can use it to report an issue/bug
				console.error( __filename +": Internal error: Please contact the project owner, with the above lines\n\n");
				process.exit(12);
			} // if retCode

			// about to RENAME org.ASUX.cmdline to just cmdline.   FYI: renameSync Returns undefined ALWAYS.
			if (process.env.VERBOSE) console.log( `about to RENAME folder ${_PROJNAME} to just ${_DIR_orgASUXSubProject} ` );
			try {
				fs.renameSync( _DIR_orgASUXSubProject_Downloaded, _DIR_orgASUXSubProject );
			} catch (err6) { // a.k.a. if fs.mkdirSync throws
				console.error( __filename +": Internal failure, renaming the folder ["+ _PROJNAME +"]\n"+ err6.toString());
				process.exit(12);
			} // try-catch err8

	} // try-catch err2
}

//============================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//============================================================

function sendArgs2SubModule( _DIR_orgASUXSubProject ) {

	if ( __dirname != process.cwd()  ) {
		if (process.env.VERBOSE) console.log("you **WERE** in the directory: '%s'", process.cwd() );
		// process.chdir(  __dirname ); <-- ATTENTION: NO LONGER CORRECT --> Need to stay in the topmost org.ASUX project working folder - to git-fetch sub-projects
		// if (process.env.VERBOSE) console.log("switched to directory: '%s'", process.cwd());
	}else{
		if (process.env.VERBOSE) console.log("You are running from where this Node.JS Script is.  Nice! %s", __dirname );
	}

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
	//--------------------------------------------------------
	prms.splice( 0, 0, _DIR_orgASUXSubProject +'/asux.js' ); // insert ./asux.js as the 1st cmdline parameter to node.js
	if (process.env.VERBOSE) { console.log( `${__filename} : running Node.JS with cmdline-arguments:` + prms.join(' ') ); }

	process.env.ORGASUXHOME=__dirname; // for use by cmdline/asux.js .. so it know where this asux.js is.

	process.exitCode = EXECUTESHELLCMD.executeSubModule(  INITIAL_CWD, 'node', prms, false, process.env.VERBOSE, false, process.env );

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