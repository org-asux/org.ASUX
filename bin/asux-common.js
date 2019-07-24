


// DO NOT 'require' this file.
// To include this file: copy the 3 lines below, into your script.


// var ORGASUXHOME = process.env.ORGASUXHOME ? process.env.ORGASUXHOME : "/invalid/path/to/parentProject/org.ASUX";
// file-included - Not a 'require'
// eval( fs.readFileSync( ORGASUXHOME+'/asux-common.js' ) + '' );



//--------------------------
var CmdLine = require('commander'); // https://github.com/tj/commander.js/
var os = require('os');     // https://nodejs.org/api/os.html
var PATH = require('path'); // to help process the script-file details.

// DO NOT DO THIS --> var fs = require("fs");     // https://nodejs.org/api/fs.html#fs_fs_accesssync_path_mode 
// This file is to be INCLUDED (not via Require)
// For this file to be 'included' (pay attention to this word 'included'), the other file must 'require("fs")' !!!!!!

//--------------------------
var ORGASUXHOME = process.env.ORGASUXHOME ? process.env.ORGASUXHOME : "/invalid/path/to/parentProject/org.ASUX";

// This is the Node.JS script within the same directory - to make it simple to run an external command
var EXECUTESHELLCMD = require( ORGASUXHOME + "/bin/ExecShellCommand.js");
// var WEBACTIONCMD = require( ORGASUXHOME + "/bin/WebActionCmd.js" );
// Oh! I never liked using WebActionCmd.js .. ONLY because it relies on sync-request, which pops up firewall alerts on BOTH MacOS and Windows 10

//========================================================================

var INITIAL_CWD = process.cwd(); // just in case I mistakenly process.chdir() somewhere below.

var CLASSPATH='';
var CLASSPATHSEPARATOR= (process.platform == 'win32')? ';' : ':';

var TMPDIR="/tmp";  // i do NOT like os.tmpdir().. as I canNOT MANUALLY find files I create there .
var ORGNAME="org-asux";

const NOINTERNETFLAGFILENAME	="/tmp/org.ASUX--no-internet";
const NOMAVENFLAGFILENAME		="/tmp/org.ASUX--no-maven";
const NOUBERJARFLAGFILENAME		="/tmp/org.ASUX--no-uberjar";
const noInternet		=	chkFlag( NOINTERNETFLAGFILENAME );
const noMaven			=	chkFlag( NOMAVENFLAGFILENAME );
const doNotUseUberJar	=	chkFlag( NOUBERJARFLAGFILENAME );

//--------------------------------------
// I'd like most of the 16 lines below to  be 'const' declarations and NOT 'var'.. .. but unfortunately.. when ANOTHER .js file includes this, the 'const' are lost!
var PROJNAME_cmdline="org.ASUX.cmdline";
var DIR_orgASUXcmdline = ORGASUXHOME + '/cmdline';
var DIR_orgASUXcmdline_Downloaded = ORGASUXHOME + '/'+ PROJNAME_cmdline;

var PROJNAME_AWS="org.ASUX.AWS";
var DIR_orgASUXAWS = ORGASUXHOME + '/AWS';
var DIR_orgASUXAWS_Downloaded = ORGASUXHOME + '/'+ PROJNAME_AWS;

var PROJNAME_AWSSDK="org.ASUX.AWS-SDK";
var DIR_orgASUXAWSSDK = ORGASUXHOME + '/AWS/AWS-SDK';
var DIR_orgASUXAWSSDK_Downloaded = ORGASUXHOME + '/'+ PROJNAME_AWSSDK;

var PROJNAME_AWSCFN="org.ASUX.AWS.CFN";
var DIR_orgASUXAWSCFN = ORGASUXHOME + '/AWS/CFN';
var DIR_orgASUXAWSCFN_Downloaded = ORGASUXHOME + '/'+ PROJNAME_AWSCFN;

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
		if ( process.argv[ix] == COMMAND ) continue; // Skip 'yaml' or 'aws' or 'aws.cfn' or .. ..
		prms.push( process.argv[ix]);
	}
	//--------------------------------------------------------
	prms.splice( 0, 0, _DIR_orgASUXSubProject +'/asux.js' ); // insert ./asux.js as the 1st cmdline parameter to node.js
	if (process.env.VERBOSE) { console.log( `${__filename} : running Node.JS with cmdline-arguments:\n` + prms.join('\n') ); }

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

function processJavaCmd( _CMD) {

	const bIsMavenInstalled = chkMavenInstalled();
	const DependenciesFile=__dirname + "/etc/classpaths/"+ CMDGRP +"-cmd.dependencies";
	const CLASSPATH = genDependencyCLASSPATH( DependenciesFile, bIsMavenInstalled );

	// ${CMDCLASS} is defined inside this properties file
	const props = require ( `${__dirname}/etc/js-source/${CMDGRP}.js-source` )

	//--------------------
	// pre-scripts (Before running ./cmdline/asux.js)
	EXECUTESHELLCMD.runPreScripts(); // ignore any exit code from these PRE-scripts

	//--------------------
	var cmdArgs = copyCmdLineArgs( _CMD, /* _bInsertDoubleHyphen */ true, /* _bAddCmd2Params */ true );
	// copyCmdLineArgs() is defined within process.env.ORGASUXHOME/asux-common.js

	cmdArgs.splice( 0, 0, '-cp' ); // insert ./asux.js as JAVA's 1st cmdline parameter
	cmdArgs.splice( 1, 0, CLASSPATH ); // insert CLASSPATH as JAVA's  2nd cmdline parameter
    cmdArgs.splice( 2, 0, "-DORGASUXHOME="+process.env.ORGASUXHOME );
    cmdArgs.splice( 3, 0, "-DAWSHOME="+process.env.AWSHOME );
    cmdArgs.splice( 4, 0, "-DAWSCFNHOME="+process.env.AWSCFNHOME );
	cmdArgs.splice( 5, 0, props['CMDCLASS'] ); // insert CMDCLASS=org.ASUX.yaml.Cmd as JAVA's  3rd cmdline parameter
	if (process.env.VERBOSE) console.log( `${__filename} : within /tmp:\n\tjava ` + cmdArgs.join(' ') +"\n" );

	const retCode = EXECUTESHELLCMD.executeSharingSTDOUT ( INITIAL_CWD, 'java', cmdArgs, true, process.env.VERBOSE, false, null );
	process.exitCode = retCode;

    //--------------------
    // OLD CODE.. where this was invoking SHELL-Scripts within {AWSCFNHOME}/bin

    // var cmdArgs = copyCmdLineArgs(  _CMD,  /* _bInsertDoubleHyphen */ false, /* _bAddCmd2Params */ false );
    // // copyCmdLineArgs() is defined within process.env.ORGASUXHOME/asux-common.js
    // if (process.env.VERBOSE) console.log( __filename +": Cmd Line params are: '" + cmdArgs.join(' ') +"'" );

    // const scriptFullPath = process.env.AWSCFNHOME+"/bin/"+_CMD +".sh";
    // const retCode = EXECUTESHELLCMD.executeSharingSTDOUT ( INITIAL_CWD, scriptFullPath, cmdArgs, true, process.env.VERBOSE, false, process.env );
    // process.exitCode = retCode;

	//--------------------
	if ( retCode == 0 ) {
		if (process.env.VERBOSE) console.log( "\n"+ __filename +": Done!");
		// process.exitCode = 0;
	}else{
		if (process.env.VERBOSE) console.error( '\n'+ __filename +": Failed with error-code "+ retCode +" for: java "+ cmdArgs.join(' '));
        // console.error( '\n'+ __filename +": Failed with error-code "+ retCode +" for: "+ scriptFullPath +" "+ cmdArgs.join(' '));
        process.exitCode = retCode;
	}

	//--------------------
	EXECUTESHELLCMD.runPostScripts(); // ignore any exit code from these Post-scripts

} // end function processJavaCmd

//========================================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//========================================================================

function runGitPullAll() {
	if ( noInternet ) {
		if (process.env.VERBOSE) console.log( "noInternet is "+ noInternet +".  So, skipping the runGitPullAll() function completely." );
		return;
	}

	runGitPull( PROJNAME_cmdline,	DIR_orgASUXcmdline	);
	runGitPull( PROJNAME_AWS,		DIR_orgASUXAWS		);
	runGitPull( PROJNAME_AWSSDK,	DIR_orgASUXAWSSDK	);
	runGitPull( PROJNAME_AWSCFN,	DIR_orgASUXAWSCFN	);
}

//========================================================================

// !!!!!!!! ATTENTION !!!!!!!!!!!! this function gitpull() only will work if the sub-project has been checkedout/pulled once already.
// Much of this function's logic is to _ONLY_ Run 'git pull' at most 1/day on this project as well as sub-projects like org.ASUX.cmdline
function runGitPull( _PROJNAME, _DIR_orgASUXSubProject ) {
		if ( noInternet ) {
			if (process.env.VERBOSE) console.log( "noInternet is "+ noInternet +".  So, skipping the runGitPull() function completely." );
			return;
		}

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
				EXECUTESHELLCMD.executionPiped(  _DIR_orgASUXSubProject, 'git', ['pull', '--quiet'], true, process.env.VERBOSE, true, process.env );

				try {
					fs.writeFileSync( LASTRUNTIMESTAMP_FILEPATH, currTimeStamp, { mode: 0o755 });
				} catch (err33) { // a.k.a. if fs.writeFileSync throws err13.code === 'ENOENT' || 'EISDIR')
					console.error( __filename +"Internal error: failed to WRITE "+ currTimeStamp +" to File @ ["+ LASTRUNTIMESTAMP_FILEPATH +"]\n"+ err33);
				}; // try-catch of fs.readFileSync ( LASTRUNTIMESTAMP_FILEPATH .. )
		} else {
				if (process.env.VERBOSE) console.log( "skipping git pull -quiet for "+ __dirname +".. .. as it was run recently "+ (currTimeStamp - lastRunTimeInSecs) +" seconds ago." );
		}


	}

//========================================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//========================================================================

function chkMavenInstalled() {

	var bIsMavenInstalled = false;

	// now .. check if Maven exists & set bIsMavenInstalled to either true or false (it is initiatlized above to undefined)
	const retCode = EXECUTESHELLCMD.executionPiped ( '/tmp', 'mvn', ['--version'], true, process.env.VERBOSE, false, null);
	if ( retCode != 0 ) {
		// if (process.env.VERBOSE) 
		if (process.env.VERBOSE) console.log("Unable to run MAVEN ('mvn' command)");
		bIsMavenInstalled = false;
	}else{
		bIsMavenInstalled = true;
	}

	return bIsMavenInstalled;

}; // function chkMavenInstalled()

//========================================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//========================================================================

function chkFlag( _flagFileName ) {

	try {
		if (process.env.VERBOSE) console.log( `checking if file ${_flagFileName} exists or not.. .. ` );
		fs.accessSync( _flagFileName, fs.constants.R_OK ); // will throw.
		// Ok. JAR file already exists!
		return true;
	} catch (err11) { // a.k.a. if fs.readFileSync throws err13.code === 'ENOENT' || 'EISDIR')
		if (process.env.VERBOSE) console.log( `FLAG-file ${_flagFileName} does ___NOT___ exist!` );
		return false;
	}

}; // function chkMavenInstalled()

//========================================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//========================================================================

function genDependencyCLASSPATH( _DependenciesFile, _bIsMavenInstalled ) {

	const JARFOLDER			=	ORGASUXHOME  +'/lib';
	const MAVENLOCALREPO	=	os.homedir() +'/.m2/repository';
	const UBERJARFILENAME	=	"org.asux.mvn-shade-uber-jar-1.0.jar";
	const UBERJARFILEPATH1	=	MAVENLOCALREPO +"/org/asux/mvn-shade-uber-jar/1.0/"+ (UBERJARFILENAME.replace('org.asux.', ''));
	const UBERJARFILEPATH2	=	JARFOLDER +"/"+ UBERJARFILENAME;

	var bAnyChanges2JARs = false; // Basically, we need to _FIGURE OUT_ whether any JAR changes triggered any MVN downloads.. so that we can help end-user make sense of what git/mvn will dump on screen.

try {
	if ( doNotUseUberJar ) {
		const e = "Flag "+ NOUBERJARFLAGFILENAME + " is set.  So, Not loading the uber-jar: "+ UBERJARFILEPATH1; // pretend that.. accessSync() - 4 lines below -- throw an exception.
		if (process.env.VERBOSE) console.log( __filename + e );
		throw e;
	}	// this above throw will make it look like the UBER-File does Not exist.

	// 1st check if the uber-jar exists..
	if (process.env.VERBOSE) console.log( `checking if ${UBERJARFILEPATH1} exists or not.. .. ` );
	fs.accessSync( UBERJARFILEPATH1, fs.constants.R_OK ); // will throw.

	// Ok. JAR file already exists in ~/.m2
	if (process.env.VERBOSE) console.log( __filename +" We can access the UBERJARFILEPATH1: ["+ UBERJARFILEPATH1 +"]");
	CLASSPATH=`${CLASSPATH}${CLASSPATHSEPARATOR}${UBERJARFILEPATH1}`;
	if (process.env.VERBOSE) console.log( __filename +": CLASSPATH = ["+ CLASSPATH +"]");
	return CLASSPATH;

} catch (err11) { // a.k.a. if fs.readFileSync throws err13.code === 'ENOENT' || 'EISDIR')
	try {
		if ( doNotUseUberJar ) {
			const e = "Flag "+ NOUBERJARFLAGFILENAME + " is set.  So, Not loading the uber-jar: "+ UBERJARFILEPATH2; // pretend that.. accessSync() - 4 lines below -- throw an exception.
			if (process.env.VERBOSE) console.log( __filename + e );
			throw e;
		}	// this above throw will make it look like the UBER-File does Not exist.

		if (process.env.VERBOSE) console.log( __filename +"Internal error: failed to access UBERJARFILEPATH1: ["+ UBERJARFILEPATH1 +"]\n"+ err11);

		// 1st check if the uber-jar exists..
		if (process.env.VERBOSE) console.log( `checking if ${UBERJARFILEPATH2} exists or not.. .. ` );
		fs.accessSync( UBERJARFILEPATH2, fs.constants.R_OK ); // will throw.

		// Ok. JAR file already exists under ${ORGASUXFLDR}/lib
		if (process.env.VERBOSE) console.log( __filename +" We can access the UBERJARFILEPATH2: ["+ UBERJARFILEPATH2 +"]");
		CLASSPATH=`${CLASSPATH}${CLASSPATHSEPARATOR}${UBERJARFILEPATH2}`;
		if (process.env.VERBOSE) console.log( __filename +": CLASSPATH = ["+ CLASSPATH +"]");
		return CLASSPATH;

	} catch (err11) { // a.k.a. if fs.readFileSync throws err13.code === 'ENOENT' || 'EISDIR')
		if (process.env.VERBOSE &&  !   doNotUseUberJar ) console.log( __filename +"Internal error: failed to access UBERJARFILEPATH2: ["+ UBERJARFILEPATH2 +"]\n"+ err11);

		try {
			if (process.env.VERBOSE) console.log( `checking if ${_DependenciesFile} exists or not.. .. ` );
			const dataBuffer = fs.readFileSync( _DependenciesFile ); // the default-FLAGs are === {encoding: "utf-8", flag: "r"}
			const data = dataBuffer.toString();
			if (process.env.VERBOSE) console.log( __filename +" file contents of _DependenciesFile: ["+ _DependenciesFile +"]\n"+ data +"\n");

			try {

				const lines = data.split('\n');
				for (var ix in lines) {
					const line = lines[ix];
					if (process.env.VERBOSE) console.log( __filename +" file contents of DependenciesFile: line #"+ ix +" = ["+ line +"]");
					if ( line.match('^#') ) continue;
					if ( line.match('^[\s\S]*$') ) continue;
					if (process.env.VERBOSE) console.log( __filename +" file contents of DependenciesFile: line #"+ ix +" = ["+ line +"]");

					// ______________________
					// function replStrFunc (match, p1, p2, p3, offset, string) { return match; }
					// outStr1WPrefix = outStr1WPrefix.replace(/^[^\n][^\n]*\n/mg, replStrFunc);
					const REGEXP='^(.*):(.*):jar:([0-9]*\.[0-9.]*)';  // https://flaviocopes.com/javascript-regular-expressions/
					let [ lineReturnedAsIs, groupId, artifactId, version ] = line.match(REGEXP);
					// const groupId = line.replace( REGEXP, "$1");
					// const artifactId = line.replace( REGEXP, "$2");
					// const version = line.replace( REGEXP, "$3");

					const folderpath=groupId.replace( new RegExp('\\.', 'g'), '/');
					const MVNfolderpath=MAVENLOCALREPO +'/'+ folderpath +'/'+ artifactId +'/'+ version;
					const JARFileName = artifactId +'-'+ version +".jar";
					const MVNJARFilePath=MVNfolderpath +'/'+ JARFileName;
					// const JARFOLDER=__dirname+'/../lib';
					const LocalJARFilePath=`${JARFOLDER}/${groupId}.${JARFileName}`;	// Note: JARFileName already === {$artifactId}-${version}.jar
					// const LocalJARFilePath=`${JARFOLDER}/${groupId}.${artifactId}.${JARFileName}`;
					// const S3FileName=`${groupId}.${artifactId}.${artifactId}-${version}.jar`;
					// const URL1 = `https://s3.amazonaws.com/org.asux.cmdline/${S3FileName}`;

					if (process.env.VERBOSE) console.log( __filename +": ["+ groupId +'.'+ artifactId +':'+ version +"]");
					if (process.env.VERBOSE) console.log( __filename +": ["+ folderpath +'\t\t'+ MVNfolderpath +'\t\t'+ MVNJARFilePath +"]");

					// ______________________
					if ( _bIsMavenInstalled && ! noMaven ) { // whether maven truly is installed, or we're pretending ..

						var bJARFileExists = false;

						// Let's see if the project's JAR File is already in ~/.m2/repository
						try {
							// if (process.env.VERBOSE) ÷console.log( `checking if ${MVNJARFilePath} exists or not.. .. ` );
							fs.accessSync( MVNJARFilePath, fs.constants.R_OK ); // will throw.
							// Ok. JAR file already exists ~/.m2
							if (process.env.VERBOSE) EXECUTESHELLCMD.showFileAttributes ( MVNJARFilePath );  // ls -la "${MVNJARFilePath}"
							CLASSPATH=`${CLASSPATH}${CLASSPATHSEPARATOR}${MVNJARFilePath}`;
							if (process.env.VERBOSE) console.log( __filename +": CLASSPATH = ["+ CLASSPATH +"]");
							bJARFileExists = true;
						} catch (err12) { // a.k.a. if fs.accessSync throws err12.code === 'ENOENT')

							try {
								if (process.env.VERBOSE) console.log( `checking if ${LocalJARFilePath} already downloaded or not.. .. ` );
								fs.accessSync( LocalJARFilePath, fs.constants.R_OK | fs.constants.W_OK ); // will throw.
								// Ok. JAR file already exists in local file system
								if (process.env.VERBOSE) EXECUTESHELLCMD.showFileAttributes ( LocalJARFilePath );  // ls -la "${LocalJARFilePath}"
								CLASSPATH=`${CLASSPATH}${CLASSPATHSEPARATOR}${LocalJARFilePath}`;
								if (process.env.VERBOSE) console.log( __filename +": after adding LocalJARFile.. .. CLASSPATH = ["+ CLASSPATH +"]");
								bJARFileExists = true;
							} catch (err15) { // a.k.a. if fs.accessSync throws err15.code === 'ENOENT')
								// if we're here, JAR is NEITHER in ~/.m2/repository - NOR in /tmpdist
								// Just let program-pointer fall thru to code below (with bJARFileExists === false)
								// do NOTHING inside this catch()
								bJARFileExists = false; // re-inforce this value, which is default @ variable definition
							} // try-catch err15 for accessSync( LocalJARFilePath )

						} // try-catch err12 for accessSync( MVNJARFilePath )

						if (  ! bJARFileExists && ! noInternet ) { // if JARs do not exist, we'll pull ONLY from Maven-central-Repo _ONLY_ if 'noInternet === false'

							// So.. MVNJARFilePath does Not exist - - NEITHER in ~/.m2/repository - NOR in /tmpdist
							bAnyChanges2JARs = true; // well, something will be new once code below executes!
							console.error( `Hmmm. ${MVNJARFilePath} does Not exist locally.` );
							const cmdArgs = ['-q', 'org.apache.maven.plugins:maven-dependency-plugin:3.1.1:get', '-DrepoUrl=url', `-Dartifact=${groupId}:${artifactId}:${version}` ];
							if (process.env.VERBOSE) console.log( __filename + ": About to run mvn "+ cmdArgs.join(' ') );
				
							const retCode = EXECUTESHELLCMD.executionPiped ( "/tmp", 'mvn', cmdArgs, true, process.env.VERBOSE, false, null);
							if ( retCode == 0 ) {
								CLASSPATH=`${CLASSPATH}${CLASSPATHSEPARATOR}${MVNJARFilePath}`;
								console.log( __filename +": CLASSPATH = ["+ CLASSPATH +"]");
							}else{
								console.error( `MAVEN could NOT download project ${groupId}.${artifactId}:${version} from MAVEN-CENTRAL\n`);
								console.error( __filename +`: Internal Fatal error. Unable to find ${MVNJARFilePath} or ${LocalJARFilePath}.\n` );
								process.exit(28);

								{ // empty block of COMMENTS only.
								// OLD CODE - I used to get the JARs from AWS via https.  No longer.  JARs are now in ${ORGASUXHOME}/lib
								// console.error( "So.. Downloading from S3.  *** Not a secure way to do things ***"  );
								// EXECUTESHELLCMD.sleep(5);
								// if we're here, JAR is NEITHER in ~/.m2/repository - NOR in /tmpdist

								// CMDLINE Tip: If the URL does NOT point to an ACTUAL file in S3, /usr/bin/curl will still get a RESPONSE from S3.
								// In order that we can tell whether a file was downloaded or not.. use "curl -f"
								// var [ httpStatusCode, errMsg ] = WEBACTIONCMD.getURLAsFileSynchronous( URL1, null, LocalJARFilePath); 
								// if ( httpStatusCode != 200 ) {
								//   console.error( __filename + ": Serious internal failure: Failure to download from ["+ URL1 +"] httoCode="+ httpStatusCode +"]");
								//   console.error( __filename + ": httpMessage = ["+ errMsg +"]");
								//   process.exit(27);
								// } else { // if-else httpStatusCode returned 200
								//   // Either the above get URL command returned a NON-zero error code, or an empty file
								//   const fstats = fs.statSync(LocalJARFilePath);
								//   if ( fstats.size <= 0 ) { // file is zero bytes!!!
								//     console.error( __filename + ": Serious internal failure: zero-byte download ["+ LocalJARFilePath +"] from: "+ URL1 );
								//     process.exit(28);
								//   }
								//   // all ok with LocalJARFilePath
								//   const cmdArgs = ['-q', `install:install-file -Dfile=${LocalJARFilePath}`, `-DgroupId=${groupId}`, `-DartifactId=${artifactId}`, `-Dversion=${version}`, '-Dpackaging=jar', '-DgeneratePom=true' ];
								//   // if (process.env.VERBOSE) 
								//   console.log( `${__filename} : in /tmp running 'mvn' with cmdline-arguments:` + cmdArgs.join(' ') );
								//   const retCode = EXECUTESHELLCMD.executionPiped ( "/tmp", 'mvn', cmdArgs, true, process.env.VERBOSE, false, null);
								//   if ( retCode == 0 ) {
								//     CLASSPATH=`${CLASSPATH}${CLASSPATHSEPARATOR}${MVNJARFilePath}`;
								//     console.log( __filename +": mvn-install succeeded, so using CLASSPATH = ["+ CLASSPATH +"]");
								//   }else{
								//     CLASSPATH=`${CLASSPATH}${CLASSPATHSEPARATOR}${LocalJARFilePath}`;
								//     console.log( __filename +": MVN install FAILED!!!!!!  So.. using LocalJARFile CLASSPATH = ["+ CLASSPATH +"]");
								//     // console.error( __filename +`Internal Fatal error. Unable to install ${MVNJARFilePath} to ${MAVENLOCALREPO}.` );
								//     // process.exit(28);
								//    }
								// } // if-else httpStatusCode
								}

							} // if-else retCode
						} // if ! bJARFileExists

					} else { // NOT _bIsMavenInstalled

						// ______________________
						// Let's see if the project is already in LOCAL-filesystem inside /lib folder of parent GIT Project
						try {
							if (process.env.VERBOSE) console.log( `checking if ${LocalJARFilePath} exists or not.. .. ` );
							fs.accessSync( LocalJARFilePath ); // will throw.
							// Ok. JAR file already exists locally on file-system
							if (process.env.VERBOSE) EXECUTESHELLCMD.showFileAttributes ( LocalJARFilePath );
							CLASSPATH=`${CLASSPATH}${CLASSPATHSEPARATOR}${LocalJARFilePath}`;
							if (process.env.VERBOSE) console.log( __filename +": CLASSPATH = ["+ CLASSPATH +"]");
						} catch (err14) {			// a.k.a. if  err14.code === 'ENOENT')

							// So.. LocalJARFilePath does *** NOT *** exist in local file system
							bAnyChanges2JARs = true; // well, something will be new once code below executes!
							console.error( `\nHmmm. ${LocalJARFilePath} does Not exist.\n${err14.message}\n` );
							console.error( __filename +`: Internal Fatal error. Unable to find ${LocalJARFilePath} (No mvn).\n` );
							process.exit(29);

							{ // empty block of COMMENTS only.
							// OLD CODE - I used to get the JARs from AWS via https.  No longer.  JARs are now in ${ORGASUXHOME}/lib
							// console.error( "Without Maven.. Downloading from S3.  *** Not a secure way to do things ***"  );
							// // var [ bSuccess, httpStatusCode, httpmsg ] = WEBACTIONCMD.getURLAsFileSynchronous( URL1, null, LocalJARFilePath); 
							// var [ httpStatusCode, errMsg ] = WEBACTIONCMD.getURLAsFileSynchronous( URL1, null, LocalJARFilePath); 
							// if ( httpStatusCode != 200 ) {
							//   console.error( __filename + ": Serious internal failure: Failure to download from ["+ URL1 +"] httoCode="+ httpStatusCode +"]");
							//   console.error( __filename + ": httpMessage = ["+ errMsg +"]");
							//   process.exit(29);
							// } else { // if-else httpStatusCode returned 200
							//     // Either the above get URL command returned a NON-zero error code, or an empty file
							//     const fstats = fs.statSync(LocalJARFilePath);
							//     if ( fstats.size <= 0 ) { // file is zero bytes!!!
							//       console.error( __filename + ": Serious internal failure: zero-byte download ["+ LocalJARFilePath +"] from: "+ URL1 );
							//       process.exit(28);
							//     }
							//     // all ok with LocalJARFilePath
							//     CLASSPATH=`${CLASSPATH}${CLASSPATHSEPARATOR}${LocalJARFilePath}`;
							//     if (process.env.VERBOSE) console.log( __filename +": CLASSPATH = ["+ CLASSPATH +"]");
							// } // if-else httpStatusCode
							}

						} // try-catch err14 for accessSync( LocalJARFilePath )

					} // if-else _bIsMavenInstalled

				} // for-LOOP (var ix in lines) <<--- !!!! <<--- !!!! <<--- !!!! <<--- !!!! <<--- !!!! 

			} catch (err13) { // a.k.a. if fs.readFileSync throws err13.code === 'ENOENT' || 'EISDIR')
				console.error( __filename +"Internal error: failed to read DependenciesFile: ["+ DependenciesFile +"]\n"+ err13);
				process.exit(23);
			}; // try-catch of fs.readFileSync ( DependenciesFile .. )

			//--------------------
			if ( bAnyChanges2JARs ) console.log('\n\n'); // well, "setup" output was observed by end-user.. so, put a couple of blank lines for readability.
			if (process.env.VERBOSE) console.log( __filename +": CLASSPATH = ["+ CLASSPATH +"]");

		} catch (err13) { // a.k.a. if fs.readFileSync throws err13.code === 'ENOENT' || 'EISDIR')
			console.error( __filename +"Internal error: failed to read _DependenciesFile: ["+ _DependenciesFile +"]\n"+ err13);
			process.exit(23);
		}; // try-catch of fs.readFileSync ( _DependenciesFile .. )
	}; // try-catch of fs.accessSync( UBERJARFILEPATH2
}; // try-catch of fs.accessSync( UBERJARFILEPATH1

	return CLASSPATH;

}; // function genDependencyCLASSPATH()

//========================================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//========================================================================

function copyCmdLineArgs( _COMMAND, _bInsertDoubleHyphen, _bAddCmd2Params ) {
	if (process.env.VERBOSE) { console.log( "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! copyCmdLineArgs( " + _COMMAND +", "+ _bInsertDoubleHyphen +" )" ); }
	// In Unix shell, If there are spaces inside the variables, then "$@" retains the spaces, while "$*" does not
	// The following lines of code are the JS-quivalent of shell's      ./cmdline/asux $@
  	// Get rid of 'node' '--verbose'(optionally) and 'asux.js'.. .. and finally the 'yaml/asux' command


	// Example: I see (on linux):     /usr/local/Cellar/node/10.2.1/bin/node /tmp/org.ASUX/cmdline/asux.js read --yamlpath s* --inputfile /tmp/nano.yaml
	// Example: I see (on Windows):   c:/program files/nodejs/node.exe  /tmp/org.ASUX/cmdline/asux.js read --yamlpath s* --inputfile /tmp/nano.yaml
	// NOTE: Since we are in the sub-module .. .. org.ASUX/asux.js will REMOVE the 'yaml' or 'aws' command - from the ARGV cmd line


	if (process.env.VERBOSE) { console.log( `${__filename} : started off with node ` + process.argv.join(' ') ); }
	const is1stCmdLineArgNodeExecutable = process.argv[0].match('.*node(.exe)?$');
	var cmdArgs = process.argv.slice( is1stCmdLineArgNodeExecutable ? 2: 1 ); // get rid of BOTH 'node' and 'asux.js'

	var cmdArgs = [];
	if (process.env.VERBOSE) {
		cmdArgs.push( '--verbose' ); // insert --verbose as JAVA's first few cmdline parameters
	}

	for (var ix in process.argv) {
		if (process.env.VERBOSE) { console.log( "copyCmdLineArgs( " + process.argv[ix] +" )" ); }
		if ( process.argv[ix].match('.*node(.exe)?$') ) continue; // get rid of node.js  or  node.exe (on windows)
			if ( ix < 2 ) continue; // For starters, Get rid of 'node' and 'asux.js'
		if ( process.argv[ix].match('--verbose') ) continue; // get rid of node.js  or  node.exe (on windows)

		// Now, JSON's Commander-library only allows 'read' 'list' 'delete' as a command.
		// But, Java Apache commons-cli REQUIRES double-hyphened command '--read'  '--list' '--delete'
		if ( process.argv[ix] != _COMMAND ) {
			cmdArgs.push( process.argv[ix] );
		} else {
			if ( _bInsertDoubleHyphen && _bAddCmd2Params ) { // re-insert the COMMAND again - Appropriately, as Java's Apache CLI requires a -- prefixing the command
				cmdArgs.push( '--'+ process.argv[ix] );
			} else {
				if ( _bAddCmd2Params ) {
					cmdArgs.push( process.argv[ix] );
				}
				// else _COMMAND will __NOT__ be added to 'cmdArgs'
			} // if-else
		} // if-else
	} // for (ix)

	return cmdArgs;
}

//========================================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//========================================================================

//EOF
