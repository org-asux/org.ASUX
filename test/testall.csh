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

set TEMPLATEFLDR=${TESTSRCFLDR}/outputs
set OUTPUTFLDR=/tmp/test-output-${PROJECTNAME}${OFFLINE}

\rm -rf ${OUTPUTFLDR}
mkdir -p ${OUTPUTFLDR}

###------------------------------
#___ echo -n "Sleep interval? >>"; set DELAY=$<
#___ if ( "$DELAY" == "" ) set DELAY=2



###------------------------------
set TESTNUM=0




###------------------------------
# 1
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  read 'paths,/pet' --delimiter , --inputfile inputs/nano.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 2
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  list '*,**,schema' --delimiter , --single-quote --inputfile inputs/nano.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
# 3
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  list 'paths,/pet,put,**,in' --delimiter , --single-quote --inputfile inputs/my-petstore-micro.yaml  \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 4
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  list 'paths,/pet,put,*,*,in' --delimiter , --single-quote --inputfile inputs/my-petstore-micro.yaml   \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 5
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  list 'paths,/pet,put,parameters,2,in' --delimiter , --single-quote --inputfile inputs/my-petstore-micro.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 6
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  list 'paths,/pet,put,parameters,[13],in' --delimiter , --single-quote --inputfile inputs/my-petstore-micro.yaml  \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
# 7
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  replace 'paths,/pet,put,parameters,[13],in' '"replaced text by asux.js"' --delimiter ,  --double-quote --showStats --inputfile inputs/my-petstore-micro.yaml  \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

##-------------------------------------------
# 8
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  delete 'paths,/pet,put,parameters,[13],in' --delimiter ,  --showStats --inputfile inputs/my-petstore-micro.yaml  \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

##-------------------------------------------
# 9
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  macroyaml "UNKNOWN=value;KEY2=VALUE222" --double-quote  --inputfile inputs/nano.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} inputs/nano.yaml
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  macroyaml @inputs/props.txt  --inputfile inputs/nano.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

###---------------------------------
# 10
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml  table 'paths,/pet,put,parameters' '../operationId,name,type,schema/ref' --showStats --delimiter , --no-quote --inputfile inputs/my-petstore-micro.yaml    \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

###---------------------------------
# 11
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js ${VERBOSE} ${OFFLINE} ${YAMLLIB}  yaml read '**,name' --project .. --delimiter , -i inputs/my-petstore-micro.yaml       \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
##@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
##-------------------------------------------

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

##-------------------------------------------
##@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
##-------------------------------------------

echo '.. about to run the tests on Batch too ..'
### assert: we should already chdir ${TESTSRCFLDR}
sleep 15
./testall-batch.csh

#EoScript
