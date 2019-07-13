#!/bin/tcsh -f

echo \
source $0:h/ListOfAllProjects.csh-source
source $0:h/ListOfAllProjects.csh-source

if ( $?IGNOREERRORS ) echo .. hmmm .. ignoring any errors

###============================================

foreach FLDR ( $PROJECTS )

	if ( -e "${FLDR}" ) then
		chdir "${FLDR}"
		pwd

		if ( -e ./test/testall.csh ) then
			./test/testall.csh $*
		else
			echo ".. ignoring .. ${FLDR} .. as it does NOT have a test/testall.csh"
		endif

	else
		echo ".. ${FLDR}  ... No-Such folder \!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\ .."
	endif

end

#EoScript
