#!/bin/bash


#___ CmdPath="$0"  <<-- Because this file is 'sourced', ${CmdPath} === "-bash"
#___ echo $CmdPath
#___ SCRIPTFLDR="$(dirname "$CmdPath")"
#___ SCRIPTFLDR="$( cd '$(dirname \"$0\")' ; pwd -P )"  <<-- there is No $0 & No $1
#___ echo ${SCRIPTFLDR}
#___ CmdName=`basename "$CmdPath"`
#___ echo ${CmdName}
set SCRIPTFLDR=$PWD

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
	### https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 10
npm install commander

popd > /dev/null

echo ''; echo ''; echo ''
echo ''; echo ''; echo ''
echo 'Recommendation: please logout and login again.. or .. (if you do NOT want to logout, then .. enter the commands in lines 27-28 (in this BASH script) on the terminal'
echo ''; echo ''; echo ''
sleep 7
echo ''; echo ''; echo ''
echo "Remember to rerun "./install" again! (in the directory ${SCRIPTFLDR})"
echo ''; echo ''; echo ''



