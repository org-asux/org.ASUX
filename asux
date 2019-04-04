#!/bin/sh

### The following line did NOT work on Windows
# CMD="${BASH_SOURCE[0]}"
CMD="$0"
# echo $CMD
CMDDIR="$(dirname "$CMD")"
# echo ${CMDDIR}

###-------------------
if [ "${CMDDIR}" != "." ]; then
        # printf "you were in the directory: "; pwd
        cd "${CMDDIR}"
        ### COMMENT: Must switch to root of org.ASUX project working folder - to fetch sub-projects
        # printf "switching to directory: "; pwd
fi

###-------------------
ORGNAME=org-asux
PROJNAME=org.ASUX.cmdline
OUTPFILE=/tmp/org.ASUX-setup-output-$$.txt

### Dont care if this command fails
### git pull  >/dev/null 2>&1
git pull --quiet

###--------------------
if [ ! -d "cmdline" ]; then
        echo ; echo 'Hmmmm.   1st time ever!?   Let me complete initial-setup (1min)...'; echo
        echo \
        git clone --quiet https://github.com/${ORGNAME}/${PROJNAME}
        git clone --quiet https://github.com/${ORGNAME}/${PROJNAME}  >${OUTPFILE} 2>&1
        if [ $? -ne 0 ]; then
                >&2 echo "Internal error: Please contact the project owner, by sending them the file '$OUTPFILE'"
                exit 9
        fi

        mv ${PROJNAME} cmdline
else
    pushd cmdline
    git pull --quiet
    popd
fi

###--------------------
### If there are spaces inside the variables, then "$@" retains the spaces, while "$*" does not

./cmdline/asux $@
### Do NOT use "exec" for above line, as it will NOT work on WINDOWS shells

exit $?

#EoScript
