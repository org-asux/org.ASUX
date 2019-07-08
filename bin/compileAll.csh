#!/bin/tcsh -f

source $0:h/ListOfAllProjects.csh-source

if ( $?IGNOREERRORS ) echo .. hmmm .. ignoring any errors

###============================================
set counter=1
foreach FLDR ( $RENAMED_PROJECTS )

	if ( -e "${FLDR}" ) then
		echo -n .
	else
		echo "  missing ${FLDR}"
		set ORIGNAME=$ORIG_PROJECTNAMES[counter]
		if (  !  -d  "${ORIGNAME}" ) then
			echo \
			git clone https://github.com/org-asux/${ORIGNAME}.git
			git clone https://github.com/org-asux/${ORIGNAME}.git
		else
			echo "  ${ORIGNAME} already exists"
		endif
		mv ${ORIGNAME} $NEWNAMES[counter]
	endif

	@ counter = $counter + 1
end
echo ''

###============================================

echo ''
echo 'Invoking Maven for each project..'
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
mvn package install:install

#EoScript
