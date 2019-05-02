set REPO=~/.m2/repository

### STEP 1:-
### convert each line   <FROM> com.fasterxml.jackson.core:jackson-annotations:jar:2.9.6
##                      <INTO> set GROUPID=.. .. ..

### STEP 2:-
### APPEND:->    set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; ls -la ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar

### STEP 3:-
### CHANGE:->    ls -la..       <FROM>  ls -la ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar
###                             <TO>    cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar


set GROUPID=com.fasterxml.jackson.core; set ARTIFACTID=jackson-databind; set VERSION=2.9.8;     set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.fasterxml.jackson.core; set ARTIFACTID=jackson-annotations; set VERSION=2.9.6;  set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.fasterxml.jackson.core; set ARTIFACTID=jackson-core; set VERSION=2.9.8; set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.fasterxml.jackson.core; set ARTIFACTID=jackson-core; set VERSION=2.9.6; set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.opencsv; set ARTIFACTID=opencsv; set VERSION=4.0;                       set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.apache.commons; set ARTIFACTID=commons-lang3; set VERSION=3.6;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.apache.commons; set ARTIFACTID=commons-text; set VERSION=1.1;           set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=commons-beanutils; set ARTIFACTID=commons-beanutils; set VERSION=1.9.3;     set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=commons-logging; set ARTIFACTID=commons-logging; set VERSION=1.2;           set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=commons-collections; set ARTIFACTID=commons-collections; set VERSION=3.2.2; set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=aws-java-sdk-core; set VERSION=1.11.541;      set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.apache.httpcomponents; set ARTIFACTID=httpclient; set VERSION=4.5.5;    set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=org.apache.httpcomponents; set ARTIFACTID=httpcore; set VERSION=4.4.10;     set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=commons-codec; set ARTIFACTID=commons-codec; set VERSION=1.10;              set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=software.amazon.ion; set ARTIFACTID=ion-java; set VERSION=1.2.0;            set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.fasterxml.jackson.dataformat; set ARTIFACTID=jackson-dataformat-cbor  set VERSION=2.9.6;        set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=joda-time; set ARTIFACTID=joda-time; set VERSION=2.8.1;                     set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=aws-java-sdk-ec2; set VERSION=1.11.541;       set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar
set GROUPID=com.amazonaws; set ARTIFACTID=jmespath-java; set VERSION=1.11.541;          set FLDR=`echo ${GROUPID} | sed -e 's|\.|/|g'`; cp -pi ${REPO}/${FLDR}/${ARTIFACTID}/${VERSION}/${ARTIFACTID}-${VERSION}.jar ${GROUPID}.${ARTIFACTID}.${ARTIFACTID}-${VERSION}.jar

