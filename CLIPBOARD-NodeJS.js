#!/usr/bin/env node

/**
 * Module dependencies.
 */

//==========================

var CmdLine = require('commander');
var PATH = require('path'); // to help process the script-file details.
var fs = require("fs"); 
var EXECUTESHELLCMD = require( __dirname + "/ExecShellCommand.js");
console.log( 'EXECUTESHELLCMD ="'+ EXECUTESHELLCMD +'"' );

// Everything you need to know about creating CUSTOM MODULES:
// https://medium.freecodecamp.org/requiring-modules-in-node-js-everything-you-need-to-know-e7fbd119be8

//==========================

// Everything you need from "process"
// https://nodejs.org/api/process.html
// 

//==========================
/* Per ECMAScript & NodeJS 10 ..
 *	const __filename = new URL(import.meta.url).pathname;
 *	// To calculate the directory containing the current module:
 *	import PATH from 'path';
 *	const __dirname = PATH.dirname(new URL(import.meta.url).pathname);
 */
console.log('the code for this script is in "%s"', process.env.INIT_CWD ); // works best for modern Node.JS
/*	If you are using pkg to package your app:-
 *	myAppDirectory = PATH.dirname( process.pkg ?
 *		process.execPath : (require.main ? require.main.filename : process.argv[0])
 *		);
 */
var PATH = require('path'); // to help process the script-file details.
console.log('1: code for this script is in "%s"', __dirname); // works for plain scripts
console.log('2: code for this script is in "%s"', PATH.dirname(require.main.filename)); // identical to above
console.log('3: code for this script is in "%s"', process.env.INIT_CWD ); // comes as UNDEFINED for Node 10.2.1
console.log('4: code for this script is in "%s"', process.cwd() ); // This is where you ran the node command
console.log('this Node.JS script file is "%s"', __filename); // works! For both the MAIN module as well as SUBMODULES!
// console.log('this Node.JS script file is "%s"', arguments.callee.toString())

var currentPath = process.cwd(); 
// where you RAN the command from!  Useful to know where user is!

/* SubModule Path is obtained by __dirname
 * To get the MainModule's location .. .. 
 *	var fnArr = (process.mainModule.filename).split('/');
 *	var filename = fnArr[fnArr.length -1];
 */

//==================================================

// BACKQUOTE `
// Template literals can be used to represent multi-line strings and may use "interpolation" to insert variables
// Template-literals can also be used to EMBED MULTI-LINE  strings into code (multiline string constants)
// EXAMPLE: if (process.env.VERBOSE) console.log( `New directory: ${process.cwd()}` );

//==================================================
/* Note that multi-word options starting with --no prefix negate the boolean value of the following word. For example, --no-sauce sets the value of CmdLine.sauce to false. */

/* angle brackets <> for required inputs
 * square brackets [] for optional inputs
 * The last argument of a command can be variadic, and only the last argument. To make an argument variadic you have to append "..." to the argument name.  An Array is used for the value of a variadic argument.
 */

CmdLine
  .version('1.0', '-v, --version')
  .usage('[options] <commands ...>')
  .option('--verbose', 'A value that can be increased by repeating', increaseVerbosity, 0)
  .option('-P, --pineapple', 'Add pineapple')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .option('-i, --integer <n>', 'An integer argument', parseInt)
  .option('-f, --float <n>', 'A float argument', parseFloat)
  .option('-r, --range <a>..<b>', 'A range', range)
  .option('-l, --list <items>', 'A list', list)
  .option('-o, --optional [value]', 'An optional value')
  .option('-c, --collect [value]', 'A repeatable value', collect, [])
  .option('-s --size <size>', 'Pizza size', /^(large|medium|small)$/i, 'medium')
	;

	// For EXCLUSIVE-use in above "--verbose" option
	function increaseVerbosity(v, total) {
		return total + 1;
	}

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
  .command('rm <dir>', {isDefault: false, noHelp: true}  )
  .option('-r, --recursive', 'Remove recursively')
  .action(function (_dir, _cmd) {
	console.log('remove ' + _dir + (_cmd.recursive ? ' recursively' : ''))
  })
	;

/* If you want --list being default-behavior (e.g. if no command was provided)..
 * WARNING!!!!!! This clashes with --help being default behavior (see below)
 */
CmdLine
  .command('list', 'list packages installed', {isDefault: false, noHelp: true}  )

CmdLine
  .command('rmdir <dir> [otherDirs...]')
  .action(function (_dir, _addlDirs) {
	dir = _dir;
	addlDirs = _addlDirs;
	console.log('rmdir %s', dir);
	if (addlDirs) {
		addlDirs.forEach(
			function (_odir) {
			console.log('rmdir %s', _odir);
			}
		);
	}
  });

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
// !!!!!!!!!!!! NOT WORKING: I get duplicate help output !!!!!!!!!!!!!!!!!!!!!!
/* If you want to display help by default (e.g. if no command was provided)..
 * WARNING!!!!!! This clashes with --list being default behavior (see above)
 */
if (!process.argv.slice(2).length) {
  CmdLine.outputHelp(showHelpInRedColor);
}
	//Used in line above.  Display the help text in red on the console
	function showHelpInRedColor(txt) {
		return colors.red(txt); 
	}

//==========================
/* execute custom actions by listening to command and option events.
 */

CmdLine.on('option:verbose', function () {
  process.env.VERBOSE = this.verbose;
});

// Show error on unknown commands
CmdLine.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', CmdLine.args.join(' '));
  process.exit(1);
});

//==========================
CmdLine.parse(process.argv);

//==========================
/* Even if a command is optional, we can reject via code like this :-) */
if (typeof dir === 'undefined') { 
   console.error('minimum 1 Directory-paths are needed. Mwaahaahaa!');
   process.exit(1);
}

/* 
 *	console.log(' verbosity: %j', CmdLine.verbose);
 *	if (CmdLine.pineapple) console.log('  - pineapple');
 *	console.log(' int: %j', CmdLine.integer);
 *	console.log(' float: %j', CmdLine.float);
 *	console.log(' list: %j', CmdLine.list);
 *	console.log(' collect: %j', CmdLine.collect);
 *	CmdLine.range = CmdLine.range || [];
 *	console.log(' range: %j..%j', CmdLine.range[0], CmdLine.range[1]);
 *	console.log('  - %s cheese', CmdLine.cheese);
 *	console.log(' size: %j', CmdLine.size);
 *	console.log('environment:', addlDirs || "no addlDirs entered on cmdline");
 */

//==================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==================================

var fileDirPath = PATH.dirname( FilePathVariable );

var fnArr = (process.mainModule.filename).split('/');
var filename = fnArr[fnArr.length -1];

fs.readFile( PATH.resolve(__dirname, 'settings.json'), 'UTF-8', callbackFunction );
// Use resolve() instead of concatenating with '/' or '\' else you will run into cross-platform issues

fs.readFile( fileName, function(err, buf) {  // <<---- Assumes No errors in reading file!
	console.log(buf.toString());
    }
);

fs.readFile( fileName,  "utf-8",  (err, data) => {
	if (err) { console.log(err)
	}else{  console.log(data); }
    }
);

fs.writeFile( fileName,  str2write, (err) => {
	if (err) { console.log(err);
	} else { console.log("Successfully Written to File.");
	}
    }
);

// Rename a file - actually involving if the NEW name exists! ! ! ! ! !
fs.rename( oldFN, newFN, function (err) {
	if(!err){ console.log( `successfully renamed $oldFN --> $newFN` ); }else { console.err(err); }
});

// Check if a file exists
fs.stat( filePath, function (err, stats) {
	if(!err){ console.log( `Yes file exists: $filePath ` + ' File-stats: ' + JSON.stringify(stats) );
	}else { console.err(err); }
  if (err) throw err;
});

// ------------- https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback --------------
//err.code
	// ENOENT (does Not exist)
	// EEXIST (file already exists)

// Check if the file exists in the current directory.
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
});

// Check if the file is readable.
fs.access(file, fs.constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'is not readable' : 'is readable'}`);
});

// Check if the file is writable.
fs.access(file, fs.constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'is not writable' : 'is writable'}`);
});

// Check if the file exists in the current directory, and if it is writable.
fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.error(
      `${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
  } else {
    console.log(`${file} exists, and it is writable`);
  }
});

//==================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==================================

// See the companion Node.JS Script-file called "ExecShellCommand.js"
var EXECUTESHELLCMD = require( ThiScriptModuleDirName + "./ExecShellCommand.js");
EXECUTESHELLCMD.result ( "git pull --quiet", function( _dn, err, response ) {
    if(!err){
        console.log(response);
    }else {
        console.log(err);
    }
});

// No need to "EXEC" git via Shell.  It's all part of Node.JS - fantastic!
// https://www.nodegit.org/
// https://www.npmjs.com/package/simple-git

//-------- ANOTHER WAY TO RUN GIT on CMDLINE -- MIMICING the PUSHD POPD of Unix-SHELLS -------
var chdir = require('chdir');
var spawn = require('child_process').spawn;

chdir('/tmp', function () { // This is a combo pushd +  popd put together
    console.log('cwd[0]=' + process.cwd());
    
    var ps = spawn('git', [
        'clone', 'https://github.com/substack/node-chdir.git'
    ]);
    ps.on('exit', function () {
        console.log('cloned into /tmp/node-chdir');
        console.log('cwd[2]=' + process.cwd());
    });
});

console.log('cwd[1]=' + process.cwd());

// The Node.js process will exit on its own if there is no additional work pending in the event loop.
// The process.exitCode property can be set to tell the process which exit code to use when the process exits gracefully.
process.exitCode = 0;


//==================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==================================
//==================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==================================
//==================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==================================
//==================================
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
//==================================

// EoScript
