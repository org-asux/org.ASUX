#!/bin/tcsh -f

###------------------------------
if (  !   $?ORGASUXFLDR ) then
        which asux >& /dev/null
        if ( $status == 0 ) then
                set ORGASUXFLDR=`which asux`
                set ORGASUXFLDR=$ORGASUXFLDR:h
                if ( "${ORGASUXFLDR}" == "." ) set ORGASUXFLDR=$cwd
                setenv ORGASUXFLDR "${ORGASUXFLDR}"
                echo "ORGASUXFLDR=$ORGASUXFLDR"
        else
                foreach FLDR ( ~/org.ASUX   ~/github/org.ASUX   ~/github.com/org.ASUX  /mnt/development/src/org.ASUX     /opt/org.ASUX  /tmp/org.ASUX  )
                        set ORIGPATH=( $path )
                        if ( -x "${FLDR}/asux" ) then
                                set ORGASUXFLDR="$FLDR"
                                set path=( $ORIGPATH "${ORGASUXFLDR}" )
                                rehash
                        endif
                end
                setenv ORGASUXFLDR "${ORGASUXFLDR}"
        endif
endif

###------------------------------
source ${ORGASUXFLDR}/test/testAll-common.csh-source

###------------------------------
set PROJECTNAME=        ### Yes, this is blank value
set PROJECTPATH="${ORGASUXFLDR}/${PROJECTNAME}"

set TESTSRCFLDR=${PROJECTPATH}/test
chdir ${TESTSRCFLDR}
if ( "$VERBOSE" != "" ) pwd

set TEMPLATEFLDR=${TESTSRCFLDR}/outputs-batch
set OUTPUTFLDR=/tmp/test-output-batch-${PROJECTNAME}${OFFLINE}

\rm -rf ${OUTPUTFLDR}
mkdir -p ${OUTPUTFLDR}

###------------------------------
#___ echo -n "Sleep interval? >>"; set DELAY=$<
#___ if ( "$DELAY" == "" ) set DELAY=2



###------------------------------
set TESTNUM=0




##-------------------------------------------
##@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
##-------------------------------------------

# 1
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
# echo 'MyRootELEMENT: ""' | asux.js ${YAMLLIB}  yaml   insert MyRootELEMENT.subElem.leafElem '{State: "available", Messages: [A,B,C], RegionName: "eu-north-1", ZoneName: "eu-north-1c", ZoneId: "eun1-az3"}'  --inputfile -  -o -
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  batch @insertReplaceBatch.txt --double-quote  --inputfile /dev/null    \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

# 2
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  batch @simpleBatch.txt --no-quote --inputfile /dev/null \
        -o ${OUTPFILE} > /dev/null   ## I have print statements n this BATCH-file, that are put onto stdout.
# echo -n "sleeping ${DELAY}s .."; sleep ${DELAY} ## waiting for output to catch up..
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 3
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE is SKIPPED ... ...
# asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  batch 'useAsInput @./inputs/AWS.AZdetails-us-east-1.json' --single-quote --inputfile /dev/null \
#         -o ${OUTPFILE}
# # echo -n "sleeping ${DELAY}s .."; sleep ${DELAY} ## waiting for output to catch up..
# diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 4
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  batch @./mapsBatch1.txt --single-quote --inputfile /dev/null  \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
# echo -n "sleeping ${DELAY}s .."; sleep ${DELAY} ## waiting for output to catch up..
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

# 5
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  batch @./mapsBatch2.txt --double-quote --inputfile /dev/null  \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
# echo -n "sleeping ${DELAY}s .."; sleep ${DELAY} ## waiting for output to catch up..
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

###---------------------------------
# 6
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE is skipped .. ..
# asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml   batch 'print \n' -i /dev/null   --single-quote  \
#         -o ${OUTPFILE} >! ${OUTPFILE}.stdout
# diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
# diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

# 7
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE is skipped .. ..
# asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml   batch  'aws.sdk --list-regions --double-quote; print -; aws.sdk --list-AZs us-east-1 --single-quote' -i /dev/null    \
#         -o ${OUTPFILE} >! ${OUTPFILE}.stdout
# diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
# diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

# 8
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml   batch  @sequenceTest1.txt --no-quote -i /dev/null    \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

# @ TESTNUM = $TESTNUM + 1
# set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
# echo $OUTPFILE
#     \
        # -o ${OUTPFILE} >! ${OUTPFILE}.stdout
# diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
# diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

###---------------------------------

set noglob
echo 'foreach fn ( ${OUTPUTFLDR}/* )'
echo '       diff ./outputs/$fn:t $fn'
echo end
###---------------------------------
#EoScript
