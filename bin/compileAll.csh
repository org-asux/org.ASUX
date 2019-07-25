#!/bin/tcsh -f

source "$0:h/ListOfAllProjects.csh-source"

if ( $?IGNOREERRORS ) echo .. hmmm .. ignoring any errors ({IGNOREERRORS} is set)

###============================================
### First download projects whose FOLDERS get RENAMED (example: org.ASUX.AWS.AWS-SDK becomes simply AWS/AWS-SDK)
### After downloading them, rename them

#___ mkdir -p "${ORGASUXFLDR}/AWS"

set counter=1
foreach FLDR ( $RENAMED_PROJECTS )

	if ( -e "${FLDR}" ) then
		echo -n .
	else
		echo "  missing ${FLDR}"
		set ORIGNAME=$ORIG_PROJECTNAMES[$counter]
		if (  !  -d  "${ORIGNAME}" ) then
			echo \
			git clone https://github.com/org-asux/${ORIGNAME}.git
			git clone https://github.com/org-asux/${ORIGNAME}.git
		else
			echo "  ${ORIGNAME} already exists"
		endif
		mv ${ORIGNAME} $NEWNAMES[$counter]
	endif

	@ counter = $counter + 1
end
echo ''

###============================================
### 2nd: download projects whose FOLDERS are RETAINED as-is (as in, the folders do _NOT_ get renamed / moved)
mkdir -p "${ORGASUXFLDR}/AWS"

foreach FLDR ( $ASIS_PROJECTS )

	if ( -e "${FLDR}" ) then
		echo -n .
	else
		if ( "${FLDR}" == "${ORGASUXFLDR}" ) then
			echo "skipping 'git clone ${ORGASUXFLDR}' for obvious reasons."
			continue
		else
			echo "  missing ${FLDR}"
			set PROJNAME=$FLDR:t
			echo \
			git clone https://github.com/org-asux/${PROJNAME}.git
			git clone https://github.com/org-asux/${PROJNAME}.git
		endif
	endif
end
echo ''

###============================================

echo ''
chdir ${ORGASUXFLDR}
mvn -f pom-TopLevelParent.xml clean package install:install
mvn -f pom-MavenCentralRepo-TopLevelParent.xml clean package install:install

###============================================

echo ''
echo 'Invoking Maven for each project..'
sleep 2

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
