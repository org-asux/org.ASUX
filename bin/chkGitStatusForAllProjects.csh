#!/bin/tcsh -f

onintr CLEANUP

###============================================

echo \
source $0:h/ListOfAllProjects.csh-source
source $0:h/ListOfAllProjects.csh-source

if ( $?IGNOREERRORS ) echo .. hmmm .. ignoring any errors

###============================================

set TMPFILE="/tmp/$0:t.$$"
set TMPFILEtemplate="/tmp/$0:t.template.$$"

### We'll compare the output of 'git status' with this
cat > "$TMPFILEtemplate" <<EOTXT
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
EOTXT

###============================================

chdir ${ORGASUXFLDR}
git pull

###-------------------------
foreach FLDR ( $PROJECTS )

	if ( -e "${FLDR}" ) then
		chdir "${FLDR}"
		pwd
		git status >& "${TMPFILE}"

		if ( $status == 0 || $?IGNOREERRORS ) then
			diff "${TMPFILE}" "${TMPFILEtemplate}" >& /dev/null
			set EXITSTATUS=$status
			if ( $EXITSTATUS != 0 ) then
				cat "${TMPFILE}"
				pwd
				if (   !   $?IGNOREERRORS ) goto CLEANUP
			endif

			git pull
			### Unlike git-status, We're __NOT__ going to bother whether or Not git-pull worked / worked as expected.

			#___ echo -n '... '; set ANS=$<
		else
			echo "FAILED \! git-status"
			pwd
			set EXITSTATUS=11
			goto CLEANUP
		endif

	else
		echo ".. ${FLDR}  ... No-Such folder \!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\ .."
	endif

end

set EXITSTATUS=$status

##@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

CLEANUP:

\rm -f "${TMPFILEtemplate}"
\rm -f "${TMPFILE}"

exit $EXITSTATUS

#EoScript
