#!/bin/tcsh -f

###------------------------------
echo "Usage: $0 [--verbose]"
# if ( $#argv <= 1 ) then
#     echo "Usage: $0  [--verbose] --delete --yamlpath yaml.regexp.path -i /tmp/input.yaml -o /tmp/output.yaml " >>& /dev/stderr
#     echo Usage: $0 'org.ASUX.yaml.Cmd [--verbose] --delete --double-quote --yamlpath "paths.*.*.responses.200" -i $cwd/src/test/my-petstore-micro.yaml -o /tmp/output2.yaml ' >>& /dev/stderr
#     echo '' >>& /dev/stderr
#     exit 1
# endif

###------------------------------
source ~/bin/include/variables.csh

set path=( $path /mnt/development/src/org.ASUX )

if ( $#argv == 1 ) then
        set VERBOSE=1
else
        unset VERBOSE
endif

set TESTSRCFLDR=/mnt/development/src/org.ASUX/test
set TEMPLATEFLDR=${TESTSRCFLDR}/outputs

###------------------------------
mkdir -p /tmp/test-output

chdir ${TESTSRCFLDR}
if ( $?VERBOSE ) pwd

###------------------------------
set JARFLDR=/mnt/development/src/org.ASUX/lib

set MYJAR=${JARFLDR}/org.ASUX.yaml.jar
set YAMLBEANSJAR=${JARFLDR}/com.esotericsoftware.yamlbeans-yamlbeans-1.13.jar
set JUNITJAR=${JARFLDR}/junit.junit.junit-4.8.2.jar
set COMMONSCLIJAR=${JARFLDR}/commons-cli-1.4.jar
setenv CLASSPATH  ${CLASSPATH}:${COMMONSCLIJAR}:${JUNITJAR}:${YAMLBEANSJAR}:${MYJAR} ## to get the jndi.properties

if ( $?VERBOSE ) echo $CLASSPATH

###---------------------------------

set noglob ### Very important to allow us to use '*' character on cmdline arguments
set noclobber

set TESTNUM=1

# node /mnt/development/src/org.ASUX/
set OUTPFILE=/tmp/test-output/test-${TESTNUM}
asux.js yaml read 'paths,/pet' --delimiter , --inputfile nano.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

@ TESTNUM = $TESTNUM + 1
set OUTPFILE=/tmp/test-output/test-${TESTNUM}
asux.js yaml list '*,**,schema' --delimiter , --inputfile nano.yaml \
        -o ${OUTPFILE}
echo $OUTPFILE
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=/tmp/test-output/test-${TESTNUM}
asux.js yaml list 'paths,/pet,put,**,in' --delimiter , --inputfile my-petstore-micro.yaml  \
        -o ${OUTPFILE}
echo $OUTPFILE
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

@ TESTNUM = $TESTNUM + 1
set OUTPFILE=/tmp/test-output/test-${TESTNUM}
asux.js yaml list 'paths,/pet,put,*,*,in' --delimiter , --inputfile my-petstore-micro.yaml   \
        -o ${OUTPFILE}
echo $OUTPFILE
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

@ TESTNUM = $TESTNUM + 1
set OUTPFILE=/tmp/test-output/test-${TESTNUM}
asux.js yaml list 'paths,/pet,put,parameters,2,in' --delimiter , --inputfile my-petstore-micro.yaml \
        -o ${OUTPFILE}
echo $OUTPFILE
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

@ TESTNUM = $TESTNUM + 1
set OUTPFILE=/tmp/test-output/test-${TESTNUM}
asux.js yaml list 'paths,/pet,put,parameters,[13],in' --delimiter , --inputfile my-petstore-micro.yaml  \
        -o ${OUTPFILE}
echo $OUTPFILE
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=/tmp/test-output/test-${TESTNUM}
asux.js yaml replace 'paths,/pet,put,parameters,[13],in' 'replaced text by asux.js' --delimiter , --inputfile my-petstore-micro.yaml  \
        -o ${OUTPFILE}
echo $OUTPFILE
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=/tmp/test-output/test-${TESTNUM}
asux.js yaml delete 'paths,/pet,put,parameters,[13],in' --delimiter , --inputfile my-petstore-micro.yaml  \
        -o ${OUTPFILE}
echo $OUTPFILE
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=/tmp/test-output/test-${TESTNUM}
asux.js yaml macro props.txt --inputfile nano.yaml \
        -o ${OUTPFILE}
echo $OUTPFILE
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=/tmp/test-output/test-${TESTNUM}
asux.js yaml batch ./simpleBatch.txt --inputfile /dev/null \
        -o ${OUTPFILE}
echo $OUTPFILE
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# @ TESTNUM = $TESTNUM + 1
# set OUTPFILE=/tmp/test-output/test-${TESTNUM}
#     \
#         -o ${OUTPFILE}
# diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

###---------------------------------

unset noglob
foreach fn ( /tmp/test-output/* )
        diff ./outputs/$fn:t $fn
end
###---------------------------------
#EoScript
