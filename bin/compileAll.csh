#!/bin/tcsh -f

source "$0:h/ListOfAllProjects.csh-source"

if ( $?IGNOREERRORS ) echo .. hmmm .. ignoring any errors ({IGNOREERRORS} is set)

###============================================
### First download projects whose FOLDERS get RENAMED (example: org.ASUX.AWS.AWS-SDK becomes simply AWS/AWS-SDK)
### After downloading them, rename them

#___ mkdir -p "${ORGASUXFLDR}/AWS"

\rm -rf ~/.m2/repository/org/asux

###============================================

chdir ${ORGASUXFLDR}

echo ''
echo 'Invoking Maven <targets> for each project.. ..'
sleep 2

###=============================================
pushd org.ASUX.pom
mvn -f pom-TopLevelParent.xml install
popd

###============================================

### Since 'org.ASUX.language.ANTLR4' has unique compiling commands

pushd org.ASUX.language.ANTLR4
git pull
./bin/clean.csh
./bin/compile.csh
mvn jar:jar install:install
popd

foreach FLDR ( $PROJECTS )

	if ( "${FLDR}" == "${ORGASUXFLDR}" ) continue;  ### We'll run mvn - for this topmost project - at the bottom of this script.

	if ( -e "${FLDR}" ) then
		chdir "${FLDR}"
		pwd
		if ( -e pom.xml ) mvn clean compiler:compile jar:jar install:install $*

		if ( $status == 0 || $?IGNOREERRORS ) then
			### Do nothing
		else
			pwd
			exit $status
		endif

	else
		echo ".. ${FLDR}  ... No-Such folder \!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\ .."
	endif

end

###============================================

echo ''
chdir ${ORGASUXFLDR}
mvn clean package install:install

#EoScript
