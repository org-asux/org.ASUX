### Sample comands on how to use AWS-CLI to Create/Wait for CFTs.

###------------ SCRATCH-VARIABLES & FOLDERS ----------
TMPDIR=/tmp/devops/CI
TMPDIR_COMPONENT=${TMPDIR}/${COMPONENTNAME}

###------------------- COMMON CONSTANTS -------------------
​
C9HOME="/home/ec2-user/environment"
CODEBUILDPROJNAME=${COMPONENTNAME}-${ENV}

DELETESTACKS_SCRIPT="${TMPDIR}/deleteStacks-${COMPONENTNAME}.sh"
​
###-------------- INIT ----------------
mkdir -p ${TMPDIR_COMPONENT}
touch ${TMPDIR_COMPONENT}/junk ### To ensure rm commands (under noglob; see many lines below) always work.

echo '' > ${DELETESTACKS_SCRIPT} ### make the file empty
chmod u+x ${DELETESTACKS_SCRIPT}

### These following lines allow us to delay the EVALUATION of '*' in "ls *" and "rm *" commands in multiple places below.
set -o noglob
STAR='*'
# echo "STAR = ${STAR}"
# set -o | grep noglob
set +o noglob
echo ''
​

cd ${TMPDIR}

​
###----------- reusable FUNCTION: delete the CFT/Stack --------------
deleteCFTStack() {
    echo "Cleaning up the Stacks "
    echo -n "Deleting Stack ${STACKNAME}-${ENV}"
    STARTTIME=$(date +%s)
    while [ 1 -eq 1 ]; do
        aws cloudformation delete-stack --stack-name ${STACKNAME}-${ENV} ### Strangely, for NON-existent-stacks, this does NOT produce ANY output. Always returns success !!!!
        sleep 10;
        aws cloudformation describe-stacks --stack-name ${STACKNAME}-${ENV} >& /dev/null
        if [ $? -ne 0 ]; then
            # echo ' [Breaking waiting-loop] CONFIRMED that the CFT is NON-existend or /DELETED !'
            break
        else
            echo -n "."
        fi
    done
    ENDTIME=$(date +%s)
    echo " .. done in $(( (ENDTIME - STARTTIME) / 60 )) minutes"
}
###------ End of Function -----

deleteCFTStack

###------ reusable FUNCTION: wait for Stack-Creation to be done -------
waitForCompleteCreationOfStack() {
    echo -n "Waiting for complete-creation of ${STACKNAME}-${ENV} .. .. "
    STARTTIME=$(date +%s)
    while [ 1 -eq 1 ]; do
        sleep 10;
        aws cloudformation describe-stacks --stack-name ${STACKNAME}-${ENV} >& /dev/null
        if [ $? -ne 0 ]; then
            echo -n "."
        else
            # echo ' [Breaking waiting-loop] CFT is created!'
            break
        fi
    done
    ENDTIME=$(date +%s)
    echo " .. done in $(( (ENDTIME - STARTTIME) / 60 )) minutes"
}
###------ End of Function -----

waitForCompleteCreationOfStack

### EoScript