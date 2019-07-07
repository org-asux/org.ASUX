#!/bin/tcsh -f

echo \
source $0:h/AllProjectsList.csh-source
source $0:h/AllProjectsList.csh-source

if ( $?IGNOREERRORS ) echo .. hmmm .. ignoring any errors

###============================================

foreach FLDR ( $PROJECTS )

	if ( -e "${FLDR}" ) then
		chdir "${FLDR}"
		pwd
		mvn clean compiler:compile jar:jar install:install $*

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

#EoScript
