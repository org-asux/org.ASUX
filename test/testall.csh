#!/bin/tcsh -f

###------------------------------
echo "Usage: $0 [--verbose]"
echo "Usage: java -DORGASUXHOME=/mnt/development/src/org.ASUX  -cp /var/build/org.asux-mvn-shade-uber-jar-1.0/org.asux-mvn-shade-uber-jar-1.0.jar org.ASUX.yaml.Cmd --batch @simpleBatch.txt -i /dev/null -o -"
# if ( $#argv <= 1 ) then
#     echo "Usage: $0  [--verbose] --delete --yamlpath yaml.regexp.path $YAMLLIB --inputfile /tmp/input.yaml -o /tmp/output.yaml " >>& /dev/stderr
#     echo Usage: $0 'org.ASUX.yaml.Cmd [--verbose] --delete --double-quote --yamlpath "paths.*.*.responses.200" $YAMLLIB --inputfile $cwd/src/test/my-petstore-micro.yaml -o /tmp/output2.yaml ' >>& /dev/stderr
#     echo '' >>& /dev/stderr
#     exit 1
# /Users/Sarma/Documents/Development/src/org.ASUX/ExecShellCommand.js :-
#                       java arguments: -cp :/Users/Sarma/.m2/repository/org/asux/common/1.0/common-1.0.jar:/Users/Sarma/.m2/repository/org/asux/yaml/1.0/yaml-1.0.jar:/Users/Sarma/.m2/repository/org/asux/yaml.collectionsimpl/1.0/yaml.collectionsimpl-1.0.jar:/Users/Sarma/.m2/repository/junit/junit/4.8.2/junit-4.8.2.jar:/Users/Sarma/.m2/repository/commons-cli/commons-cli/1.4/commons-cli-1.4.jar:/Users/Sarma/.m2/repository/com/esotericsoftware/yamlbeans/yamlbeans/1.13/yamlbeans-1.13.jar:/Users/Sarma/.m2/repository/org/yaml/snakeyaml/1.24/snakeyaml-1.24.jar:/Users/Sarma/.m2/repository/com/fasterxml/jackson/core/jackson-databind/2.9.8/jackson-databind-2.9.8.jar:/Users/Sarma/.m2/repository/com/fasterxml/jackson/core/jackson-annotations/2.9.6/jackson-annotations-2.9.6.jar:/Users/Sarma/.m2/repository/com/fasterxml/jackson/core/jackson-core/2.9.8/jackson-core-2.9.8.jar:/Users/Sarma/.m2/repository/com/fasterxml/jackson/core/jackson-core/2.9.6/jackson-core-2.9.6.jar:/Users/Sarma/.m2/repository/com/opencsv/opencsv/4.0/opencsv-4.0.jar:/Users/Sarma/.m2/repository/org/apache/commons/commons-lang3/3.6/commons-lang3-3.6.jar:/Users/Sarma/.m2/repository/org/apache/commons/commons-text/1.1/commons-text-1.1.jar:/Users/Sarma/.m2/repository/commons-beanutils/commons-beanutils/1.9.3/commons-beanutils-1.9.3.jar:/Users/Sarma/.m2/repository/commons-logging/commons-logging/1.2/commons-logging-1.2.jar:/Users/Sarma/.m2/repository/commons-collections/commons-collections/3.2.2/commons-collections-3.2.2.jar:/Users/Sarma/.m2/repository/com/amazonaws/aws-java-sdk-core/1.11.541/aws-java-sdk-core-1.11.541.jar:/Users/Sarma/.m2/repository/org/apache/httpcomponents/httpclient/4.5.5/httpclient-4.5.5.jar:/Users/Sarma/.m2/repository/org/apache/httpcomponents/httpcore/4.4.10/httpcore-4.4.10.jar:/Users/Sarma/.m2/repository/commons-codec/commons-codec/1.10/commons-codec-1.10.jar:/Users/Sarma/.m2/repository/software/amazon/ion/ion-java/1.2.0/ion-java-1.2.0.jar:/Users/Sarma/.m2/repository/com/fasterxml/jackson/dataformat/jackson-dataformat-cbor/2.9.6/jackson-dataformat-cbor-2.9.6.jar:/Users/Sarma/.m2/repository/joda-time/joda-time/2.8.1/joda-time-2.8.1.jar:/Users/Sarma/.m2/repository/com/amazonaws/aws-java-sdk-ec2/1.11.541/aws-java-sdk-ec2-1.11.541.jar:/Users/Sarma/.m2/repository/com/amazonaws/jmespath-java/1.11.541/jmespath-java-1.11.541.jar
#                       org.ASUX.yaml.Cmd --verbose --yamllibrary CollectionsImpl
#                       --batch @./mapsBatch1.txt -i /dev/null -o -
#
# endif

###------------------------------
# set YAMLLIB=( --yamllibrary com.esotericsoftware.yamlbeans )
set YAMLLIB=( --yamllibrary NodeImpl )
set ORGASUXFLDR=/mnt/development/src/org.ASUX
set path=( $path ${ORGASUXFLDR} )
set TESTSRCFLDR=${ORGASUXFLDR}/test
if (  !  $?CLASSPATH ) setenv CLASSPATH ''

###------------------------------
if ( $#argv == 1 ) then
        set VERBOSE=1
else
        unset VERBOSE
endif

chdir ${TESTSRCFLDR}
pwd

if ( ! -e ~/.aws/profile ) then
        echo "AWS login credentials missing in a file ./profile"
        exit 2
endif

###------------------------------
echo -n "Sleep interval? >>"; set DELAY=$<
if ( "$DELAY" == "" ) set DELAY=2

set TEMPLATEFLDR=${TESTSRCFLDR}/outputs
set OUTPUTFLDR=/tmp/test-output

###------------------------------
\rm -rf ${OUTPUTFLDR}
mkdir -p ${OUTPUTFLDR}

alias diff \diff -bB

###------------------------------
set JARFLDR=${ORGASUXFLDR}/lib

# set MYJAR1=${JARFLDR}/org.ASUX.common.jar
# set MYJAR2=${JARFLDR}/org.ASUX.yaml.jar
# set MYJAR3=${JARFLDR}/org.ASUX.yaml.collectionsimpl.jar
# set YAMLBEANSJAR=${JARFLDR}/com.esotericsoftware.yamlbeans-yamlbeans-1.13.jar
# set JUNITJAR=${JARFLDR}/junit.junit.junit-4.8.2.jar
# set COMMONSCLIJAR=${JARFLDR}/commons-cli-1.4.jar
# setenv CLASSPATH  ${CLASSPATH}:${COMMONSCLIJAR}:${JUNITJAR}:${YAMLBEANSJAR}:${MYJAR} ## to get the jndi.properties

if ( $?VERBOSE ) echo $CLASSPATH

###---------------------------------

set noglob ### Very important to allow us to use '*' character on cmdline arguments
set noclobber

set TESTNUM=1

# 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  read 'paths,/pet' --delimiter , --inputfile inputs/nano.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 2
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  list '*,**,schema' --delimiter , --single-quote --inputfile inputs/nano.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
# 3
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  list 'paths,/pet,put,**,in' --delimiter , --single-quote --inputfile inputs/my-petstore-micro.yaml  \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 4
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  list 'paths,/pet,put,*,*,in' --delimiter , --single-quote --inputfile inputs/my-petstore-micro.yaml   \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 5
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  list 'paths,/pet,put,parameters,2,in' --delimiter , --single-quote --inputfile inputs/my-petstore-micro.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 6
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  list 'paths,/pet,put,parameters,[13],in' --delimiter , --single-quote --inputfile inputs/my-petstore-micro.yaml  \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
# 7
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  replace 'paths,/pet,put,parameters,[13],in' 'replaced text by asux.js' --delimiter ,  --double-quote --showStats --inputfile inputs/my-petstore-micro.yaml  \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

##-------------------------------------------
# 8
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  delete 'paths,/pet,put,parameters,[13],in' --delimiter ,  --showStats --inputfile inputs/my-petstore-micro.yaml  \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

##-------------------------------------------
# 9
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  macroyaml "UNKNOWN=value;KEY2=VALUE222" --double-quote  --inputfile inputs/nano.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} inputs/nano.yaml
asux.js yaml  $YAMLLIB  macroyaml @inputs/props.txt  --inputfile inputs/nano.yaml \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

##-------------------------------------------
# 10
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  batch @simpleBatch.txt --no-quote --inputfile /dev/null \
        -o ${OUTPFILE} > /dev/null   ## I have print statements n this BATCH-file, that are put onto stdout.
# echo -n "sleeping ${DELAY}s .."; sleep ${DELAY} ## waiting for output to catch up..
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 11
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  batch 'useAsInput @./inputs/AWS.AZdetails-us-east-1.json' --single-quote --inputfile /dev/null \
        -o ${OUTPFILE}
# echo -n "sleeping ${DELAY}s .."; sleep ${DELAY} ## waiting for output to catch up..
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 12
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  batch @./mapsBatch1.txt --single-quote --inputfile /dev/null  \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
# echo -n "sleeping ${DELAY}s .."; sleep ${DELAY} ## waiting for output to catch up..
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

# 13
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  batch @./mapsBatch2.txt --single-quote --inputfile /dev/null  \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
# echo -n "sleeping ${DELAY}s .."; sleep ${DELAY} ## waiting for output to catch up..
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

###---------------------------------
# 14
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
# echo 'MyRootELEMENT: ""' | asux.js yaml  $YAMLLIB   insert MyRootELEMENT.subElem.leafElem '{State: "available", Messages: [A,B,C], RegionName: "eu-north-1", ZoneName: "eu-north-1c", ZoneId: "eun1-az3"}'  --inputfile -  -o -
asux.js yaml  $YAMLLIB  batch @insertReplaceBatch.txt --double-quote  --inputfile /dev/null    \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

# 15
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml  $YAMLLIB  table 'paths,/pet,put,parameters' 'name,type' --showStats --delimiter , --no-quote --inputfile inputs/my-petstore-micro.yaml    \
        -o ${OUTPFILE}
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}

# 16
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml batch 'print \n' -i /dev/null    \
        -o ${OUTPFILE} >! ${OUTPFILE}.stdout
diff ${OUTPFILE} ${TEMPLATEFLDR}/test-${TESTNUM}
diff ${OUTPFILE}.stdout ${TEMPLATEFLDR}/test-${TESTNUM}.stdout

# 17
@ TESTNUM = $TESTNUM + 1
set OUTPFILE=${OUTPUTFLDR}/test-${TESTNUM}
echo $OUTPFILE
asux.js yaml batch  'aws.sdk --list-regions --double-quote; print -; aws.sdk --list-AZs us-east-1 --single-quote' -i /dev/null    \
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
