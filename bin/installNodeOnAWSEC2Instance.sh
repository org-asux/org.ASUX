#!/bin/bash


###-------------------
### The following line did NOT work on Windows
# CmdPath="${BASH_SOURCE[0]}"

### The following does NOT work on GNU bash, version 4.2.46(2) (AWS-EC2 default shell as of 2020)
# CmdPath="$0"
# # echo $CmdPath
# SCRIPTFLDR_RELATIVE="$(dirname "$CmdPath")"
# SCRIPTFULLFLDRPATH="$( cd "$(dirname "$0")" ; pwd -P )"

SCRIPTFULLFLDRPATH=~/org.ASUX
echo "SCRIPTFULLFLDRPATH = '${SCRIPTFULLFLDRPATH}'"

# set SCRIPTFLDR=$PWD

###-------------------

if [ "${SCRIPTFLDR_RELATIVE}" != "." ]; then
	orgASUXFldr="${SCRIPTFULLFLDRPATH}"
else
	orgASUXFldr=`pwd`
fi
echo "orgASUXFldr = '${orgASUXFldr}''"

###=====================================================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###=====================================================================

if [ "${CmdName}" == "installNodeOnAWSEC2Instance.sh" ]; then

	echo ''; echo ''; echo ''
	>&2 echo '.. you must run this command as follows:-         (ATTENTION: NO NEED   NO NEED   NO NEED  --> sudo -i)'
	echo ''
	>&2 echo "	  .   ${CmdName}"
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
npm install -g commander@2.20.0

popd > /dev/null

###-------------------
### NOTE: This function will __ALSO__ change the PATH for this shell-session
### NOTE: This function is DUPLICATED from '${orgASUXFldr}/install'
addToPathInBashrc()
{
	echo ' ' >> ~/.bashrc
	echo 'export PATH="'${orgASUXFldr}'":${PATH}' >> ~/.bashrc
	>&2 echo 'Done!'

	export PATH=${orgASUXFldr}:${PATH}	### This will also change the PATH for this shell-session
}

###-------------------

addToPathInBashrc

###-------------------
>&2 echo ''; echo ''; echo ''
>&2 echo ''; echo ''; echo ''
>&2 echo 'A 3-step Recommendation: Cntl-C, then logout & login again, then re-install'
>&2 echo ''; echo ''; echo ''
sleep 7
>&2 echo ' '
>&2 read -p 'If you would like the easy way, let us _TRY_ to continue the "install" command.  Press Cntl-C to STOP (for any reason), or .. Otherwise press ENTER key to continue' BLACKHOLEVARIABLE
# >&2 echo ''; echo ''; echo ''
# >&2 echo "Remember to rerun "./install" again! (in the directory ${SCRIPTFULLFLDRPATH})"
# >&2 echo ''; echo ''; echo ''

export NODE_PATH=`npm root -g`
echo export NODE_PATH=`npm root -g` >> ~/.bashrc
echo export NODE_PATH=`npm root -g` >> ~/.zshenv
echo setenv NODE_PATH `npm root -g` >> ~/.cshrc

./install

### EoScript

