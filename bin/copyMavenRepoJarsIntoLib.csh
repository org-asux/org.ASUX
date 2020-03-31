#!/bin/tcsh -f

### STEP 1:-
### convert each line   <FROM> com.fasterxml.jackson.core:jackson-annotations:jar:2.9.6
###                     <INTO> set GROUPID=.. .. ..
###        map t 0f:s; set ARTIFACTID=<Esc>
###        /:jar:
###        map t nc5 ; set VERSION=<Esc>
###        /:compile$
###        map t nD"ap
###        /:runtime$

### STEP 2:-
### APPEND:->    set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; ls -la ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar

### STEP 3:-
### CHANGE:->    ls -la..       <FROM>  ls -la ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar
###                             <TO>    cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar

###============================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###============================================

set SCRIPTDIR="$0:h"
if ( "${SCRIPTDIR}" == "$0" ) then
        ### TCSH Quirk:  this means '$0' is purely a simple file name with NO path-prefix (not even './')
        set SCRIPTDIR="$cwd"
else
    if ( "${SCRIPTDIR}" == "." || "${SCRIPTDIR}" == "" ) then
        set SCRIPTDIR="$cwd"
    endif
endif

#__  echo "SCRIPTDIR=[${SCRIPTDIR}]"
chdir ${SCRIPTDIR}/..  ### Get out of BIN subfolder
pwd

if ( ! -e lib ) then
    echo "Unable to find the 'lib' SUB-FOLDER at ${SCRIPTDIR}"
    exit 1
endif

set noglob
if ( -e lib/*.jar ) then
    echo -n 'did you "git rm *.jar" (that is, _ALL_ files) in this LIB folder? >>'; set ANS=$<
endif

chdir lib

###============================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###============================================

set REPO=${HOME}/.m2/repository

###============================================
###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
###============================================

echo ''
echo -n 'Proceed? >>'; set ANS=$<

set GROUPID=org.asux; set ARTIFACTID=common; set VERSION=1.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.junit.vintage; set ARTIFACTID=junit-vintage-engine; set VERSION=5.5.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.apiguardian; set ARTIFACTID=apiguardian-api; set VERSION=1.1.0;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.junit.platform; set ARTIFACTID=junit-platform-engine; set VERSION=1.5.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.opentest4j; set ARTIFACTID=opentest4j; set VERSION=1.2.0;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.junit.platform; set ARTIFACTID=junit-platform-commons; set VERSION=1.5.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=junit; set ARTIFACTID=junit; set VERSION=4.12;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.hamcrest; set ARTIFACTID=hamcrest-core; set VERSION=1.3;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.asux; set ARTIFACTID=yaml; set VERSION=1.1;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.asux; set ARTIFACTID=language.antlr4; set VERSION=1.0;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.asux; set ARTIFACTID=yaml.nodeimpl; set VERSION=1.0;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.antlr; set ARTIFACTID=antlr4; set VERSION=4.7.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.antlr; set ARTIFACTID=antlr4-runtime; set VERSION=4.7.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.antlr; set ARTIFACTID=antlr-runtime; set VERSION=3.5.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.antlr; set ARTIFACTID=ST4; set VERSION=4.1;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.abego.treelayout; set ARTIFACTID=org.abego.treelayout.core; set VERSION=1.0.3;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.glassfish; set ARTIFACTID=javax.json; set VERSION=1.0.4;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.ibm.icu; set ARTIFACTID=icu4j; set VERSION=61.1;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.yaml; set ARTIFACTID=snakeyaml; set VERSION=1.24;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=commons-cli; set ARTIFACTID=commons-cli; set VERSION=1.4;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.opencsv; set ARTIFACTID=opencsv; set VERSION=4.6;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.apache.commons; set ARTIFACTID=commons-lang3; set VERSION=3.8.1;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.apache.commons; set ARTIFACTID=commons-text; set VERSION=1.3;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=commons-beanutils; set ARTIFACTID=commons-beanutils; set VERSION=1.9.3;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=commons-collections; set ARTIFACTID=commons-collections; set VERSION=3.2.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.apache.commons; set ARTIFACTID=commons-collections4; set VERSION=4.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.fasterxml.jackson.core; set ARTIFACTID=jackson-databind; set VERSION=2.9.9;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.fasterxml.jackson.core; set ARTIFACTID=jackson-annotations; set VERSION=2.9.0;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.fasterxml.jackson.core; set ARTIFACTID=jackson-core; set VERSION=2.9.9;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=s3; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=aws-xml-protocol; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=aws-query-protocol; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=protocol-core; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=sdk-core; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=profiles; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=auth; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.eventstream; set ARTIFACTID=eventstream; set VERSION=1.0.1;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=http-client-spi; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=regions; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=annotations; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=aws-core; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=apache-client; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.apache.httpcomponents; set ARTIFACTID=httpcore; set VERSION=4.4.11;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=netty-nio-client; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=io.netty; set ARTIFACTID=netty-codec-http; set VERSION=4.1.33.Final;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=io.netty; set ARTIFACTID=netty-codec-http2; set VERSION=4.1.33.Final;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=io.netty; set ARTIFACTID=netty-codec; set VERSION=4.1.33.Final;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=io.netty; set ARTIFACTID=netty-transport; set VERSION=4.1.33.Final;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=io.netty; set ARTIFACTID=netty-resolver; set VERSION=4.1.33.Final;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=io.netty; set ARTIFACTID=netty-common; set VERSION=4.1.33.Final;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=io.netty; set ARTIFACTID=netty-buffer; set VERSION=4.1.33.Final;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=io.netty; set ARTIFACTID=netty-handler; set VERSION=4.1.33.Final;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=io.netty; set ARTIFACTID=netty-transport-native-epoll; set VERSION=4.1.33.Final;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=io.netty; set ARTIFACTID=netty-transport-native-unix-common; set VERSION=4.1.33.Final;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.typesafe.netty; set ARTIFACTID=netty-reactive-streams-http; set VERSION=2.0.0;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.typesafe.netty; set ARTIFACTID=netty-reactive-streams; set VERSION=2.0.0;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.awssdk; set ARTIFACTID=utils; set VERSION=2.7.14;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.reactivestreams; set ARTIFACTID=reactive-streams; set VERSION=1.0.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.slf4j; set ARTIFACTID=slf4j-api; set VERSION=1.7.25;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=aws-java-sdk-core; set VERSION=1.11.612;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=commons-logging; set ARTIFACTID=commons-logging; set VERSION=1.1.3;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.apache.httpcomponents; set ARTIFACTID=httpclient; set VERSION=4.5.9;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=commons-codec; set ARTIFACTID=commons-codec; set VERSION=1.11;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.ion; set ARTIFACTID=ion-java; set VERSION=1.0.2;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.fasterxml.jackson.dataformat; set ARTIFACTID=jackson-dataformat-cbor; set VERSION=2.6.7;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=joda-time; set ARTIFACTID=joda-time; set VERSION=2.8.1;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=aws-java-sdk-ec2; set VERSION=1.11.612;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=jmespath-java; set VERSION=1.11.612;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=aws-java-sdk-route53; set VERSION=1.11.612;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=aws-java-sdk-iam; set VERSION=1.11.612;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=aws-java-sdk-s3; set VERSION=1.11.612;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=aws-java-sdk-kms; set VERSION=1.11.612;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=aws-java-sdk-sts; set VERSION=1.11.612;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar

