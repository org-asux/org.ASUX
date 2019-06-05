#!/bin/bash


CmdPath="$0"
#___ echo $CmdPath
#___ SCRIPTFLDR="$(dirname "$CmdPath")"
SCRIPTFLDR="$( cd "$(dirname "$0")" ; pwd -P )"
#___ echo ${SCRIPTFLDR}
CmdName=`basename "$CmdPath"`
#___ echo ${CmdName}

if [ "${CmdName}" == "installNodeOnAWSEC2Instance.sh" ]; then

	echo ''; echo ''; echo ''
	echo '.. you must run this command as follows:-         (ATTENTION: NO NEED   NO NEED   NO NEED  --> sudo -i)'
	echo ''
	echo "	  .   ${CmdName}"
	echo ''; echo ''; echo ''
	# read -p "CONFIRM all of the above (#1): "  Variable
	# read -p "CONFIRM all of the above (#2): "  Variable
	# read -p "CONFIRM all of the above (#3): "  Variable
	exit 1
fi

pushd ~ > /dev/null
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 7
npm install commander

popd > /dev/null

echo ''; echo ''; echo ''
echo ''; echo ''; echo ''
echo 'please logout and login again.. or .. (if you do NOT want to logout, then .. enter the commands in lines 23-26 (in this BASH script) on the terminal'
echo ''; echo ''; echo ''


