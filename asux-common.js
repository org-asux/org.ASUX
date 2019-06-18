// To include this file: copy the 3 lines below

// var ORGASUXHOME = process.env.ORGASUXHOME ? process.env.ORGASUXHOME : "/invalid/path/to/parentProject/org.ASUX";
// file-included - Not a 'require'
// eval( fs.readFileSync( ORGASUXHOME+'/asux-common.js' ) + '' );



//--------------------------
var CmdLine = require('commander'); // https://github.com/tj/commander.js/
var os = require('os');     // https://nodejs.org/api/os.html
var PATH = require('path'); // to help process the script-file details.

//--------------------------
var ORGASUXHOME = process.env.ORGASUXHOME ? process.env.ORGASUXHOME : "/invalid/path/to/parentProject/org.ASUX";
var INITIAL_CWD = process.cwd(); // just in case I mistakenly process.chdir() somewhere below.

// This is the Node.JS script within the same directory - to make it simple to run an external command
var EXECUTESHELLCMD = require( ORGASUXHOME + "/ExecShellCommand.js");
// var WEBACTIONCMD = require( ORGASUXHOME + "/WebActionCmd.js" );
// Oh! I never liked using WebActionCmd.js .. ONLY because it relies on sync-request, which pops up firewall alerts on BOTH MacOS and Windows 10

//========================================================================

var INITIAL_CWD = process.cwd(); // just in case I mistakenly process.chdir() somewhere below.

var CLASSPATH='';
var CLASSPATHSEPARATOR= (process.platform == 'win32')? ';' : ':';

var TMPDIR="/tmp";  // i do NOT like os.tmpdir().. as I canNOT MANUALLY find files I create there .
var ORGNAME="org-asux";

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

function genDependencyCLASSPATH( _DependenciesFile, _bIsMavenInstalled ) {

	var bAnyChanges2JARs = false;
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
				const MAVENLOCALREPO=os.homedir()+'/.m2/repository';
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
				const JARFOLDER=ORGASUXHOME+'/lib';
				const LocalJARFilePath=`${JARFOLDER}/${groupId}.${artifactId}.${JARFileName}`;
				// const S3FileName=`${groupId}.${artifactId}.${artifactId}-${version}.jar`;
				// const URL1 = `https://s3.amazonaws.com/org.asux.cmdline/${S3FileName}`;

				if (process.env.VERBOSE) console.log( __filename +": ["+ groupId +'.'+ artifactId +':'+ version +"]");
				if (process.env.VERBOSE) console.log( __filename +": ["+ folderpath +'\t\t'+ MVNfolderpath +'\t\t'+ MVNJARFilePath +"]");

				// ______________________
				if ( _bIsMavenInstalled ) {

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

					if (  ! bJARFileExists ) {

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

				} else { // if _bIsMavenInstalled

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

			} // for lineObj of iterator

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

	return CLASSPATH;
}; // function genDependencyCLASSPATH()

//========================================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//========================================================================

function copyCmdLineArgs( _COMMAND ) {
	// In Unix shell, If there are spaces inside the variables, then "$@" retains the spaces, while "$*" does not
	// The following lines of code are the JS-quivalent of shell's      ./cmdline/asux $@
  	// Get rid of 'node' '--verbose'(optionally) and 'asux.js'.. .. and finally the 'yaml/asux' command


	// Example: I see (on linux):     /usr/local/Cellar/node/10.2.1/bin/node /tmp/org.ASUX/cmdline/asux.js read --yamlpath s* --inputfile /tmp/nano.yaml
	// Example: I see (on Windows):   c:/program files/nodejs/node.exe  /tmp/org.ASUX/cmdline/asux.js read --yamlpath s* --inputfile /tmp/nano.yaml
	// NOTE: Since we are in the sub-module .. .. org.ASUX/asux.js will REMOVE the 'yaml' or 'aws' command - from the ARGV cmd line


	if (process.env.VERBOSE) { console.log( `${__filename} : started off with node ` + process.argv.join(' ') ); }
	var cmdArgs = process.argv.slice( ( process.argv[0].match('.*node(.exe)?$') )? 2: 1 ); // get rid of BOTH 'node' and 'asux.js' (or.. just asux.sh)

	var cmdArgs = [];
	if (process.env.VERBOSE) {
		cmdArgs.push( '--verbose' ); // insert --verbose as JAVA's first few cmdline parameters
	}

	for (var ix in process.argv) {
		if ( process.argv[ix].match('.*node(.exe)?$') ) continue; // get rid of node.js  or  node.exe (on windows)
			if ( ix < 2 ) continue; // For starters, Get rid of 'node' and 'asux.js'
		if ( process.argv[ix].match('--verbose') ) continue; // get rid of node.js  or  node.exe (on windows)

		// Now, JSON's Commander-library only allows 'read' 'list' 'delete' as a command.
		// But, Java Apache commons-cli REQUIRES double-hyphened command '--read'  '--list' '--delete'
		if ( process.argv[ix] == _COMMAND ) { // re-insert the COMMAND again - Appropriately, as Java's Apache CLI requires a -- prefixing the command
			cmdArgs.push( '--'+process.argv[ix]);
		} else {
			cmdArgs.push( process.argv[ix]);
		}
	} // for ix

	return cmdArgs;
}

//========================================================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//========================================================================

//EOF
