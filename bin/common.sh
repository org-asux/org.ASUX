#!/bin/false


## This must be sourced within other BASH files



### !!!!!!!!!! NOTE:  $0 is _NOT_ === {ORGASUXHOME}/bin/common.sh)

###=============================================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###=============================================================

terminateEntireScriptProcess()
{
	kill -SIGUSR1 `ps -p $$ -oppid=`	### On MacOS Shell, 'ps --pid' does _NOT_ work.  Instead using 'ps -p'
	exit $1
	### Note: In PARENT (Invoking) Shell-script.. add the following (as a Go-to block)
	###		trap "echo exitting because my child killed me.>&2;exit" SIGUSR1
}

###=============================================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###=============================================================

if [ -z ${SCRIPTFULLFLDRPATH+x} ]; then  ### if [ -z "$var" ]    <-- does NOT distinguish between 'unset var' & var=""
	>&2 echo "The topmost script that 'includes (a.k.a.) sources' common.sh must define SCRIPTFULLFLDRPATH ${SCRIPTFULLFLDRPATH}"
	terminateEntireScriptProcess 9
fi

ERRMSG1="Coding-ERROR: BEFORE sourcing common.sh, you MUST set variables like AWSRegion (=${AWSRegion}) and ORGASUXHOME (=${ORGASUXHOME}).   The best way is to run using 'asux.js' and to _LOAD_ job-Master.properties"
if [ -z ${ORGASUXHOME+x} ]; then  ### if [ -z "$var" ]    <-- does NOT distinguish between 'unset var' & var=""
	>&2 echo $ERRMSG1
	terminateEntireScriptProcess 9

	### !!!!!!!!!! ATTENTION.  This could be invoked within _OTHER_ includable/source-able  .SH file (like {AWSSDK}/bin/common.sh)
	### So, you _REALLY_ have to allow those scripts to define ORGASUXHOME
fi

# ORGASUXHOME=${SCRIPTFULLFLDRPATH}				### /mnt/development/src/org.ASUX/AWS/CFN/bin
# ORGASUXHOME="$(dirname "$ORGASUXHOME")"		### /mnt/development/src/org.ASUX/AWS/CFN
# ORGASUXHOME="$(dirname "$ORGASUXHOME")"		### /mnt/development/src/org.ASUX/AWS
# ORGASUXHOME="$(dirname "$ORGASUXHOME")"		### /mnt/development/src/org.ASUX
# if [ "${VERBOSE}" == "1" ]; then echo ORGASUXHOME=${ORGASUXHOME}; fi

###=============================================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###=============================================================

export PATH=${PATH}:${ORGASUXHOME}

if [ ! -e "${ORGASUXHOME}/asux.js" ]; then
	>&2 echo "Please edit this file $0 to set the correct value of 'ORGASUXHOME'"
	>&2 echo "	This command will fail until correction is made from current value of ${ORGASUXHOME}"
	terminateEntireScriptProcess 5
fi

###-------------------
pushd /tmp/.  > /dev/null


###-------------------
### Check to see if org.ASUX project (Specifically, the program 'node' and asux.js) exists - and.. is in the path.


command -v asux.js > /dev/null
if [ $? -ne 0 ]; then
	>&2 echo ' '
	>&2 echo "Either Node.JS (node) is NOT installed or .. org.ASUX git-project's folder is NOT in the path."
	>&2 echo "ATTENTION !!! Unfortunately, you have to do fix this MANUALLY."
	>&2 echo "	This command will fail until correction is made"
	sleep 2
	terminateEntireScriptProcess 6
else
	if [ "${VERBOSE}" == "1" ]; then
		echo "[y] verified that Node.JS (node) is installed"
		echo "[y] verified that ${ORGASUXHOME}/asux.js can be executed"
	fi
fi

###-------------------
popd > /dev/null		### See matching 'pushd /tmp/.' about 20 lines above'

###=============================================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###=============================================================


###-------------------
### An easy2use method to help clear out TEMPORARY files, which double-checking things, to ensure thoroughness.

ensureTempFileDoesNotExist()
{
	set TMPFILE="$1"
	if [ -e ${TMPFILE} ]; then
		OUTPUTSTR=`ls -la ${TMPFILE}`
		rm ${TMPFILE}
		if [ $? != 0 ]; then
			>&2 echo "Failed to delete '${TMPFILE}'.  This is a FATAL ERROR !!!!!!!!!!!!!!!!!!"
			>&2 echo ${OUTPUTSTR}
			kill -SIGUSR1 `ps --pid $$ -oppid=`; exit
			### Note: In PARENT (Invoking) Shell-script.. add the following (as a Go-to block)
			###		trap "echo exitting because my child killed me.>&2;exit" SIGUSR1
		fi
	fi
}

###=============================================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###=============================================================

###=============================================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###=============================================================

###=============================================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###=============================================================

#EoF
