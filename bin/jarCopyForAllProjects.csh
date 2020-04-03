#!/bin/tcsh -f

echo \
source $0:h/ListOfAllProjects.csh-source
source $0:h/ListOfAllProjects.csh-source

if ( $?IGNOREERRORS ) echo .. hmmm .. ignoring any errors

set MVNREPO=~/.m2/repository
set ORGASUXMVNREPOHOME=${MVNREPO}/org/asux
set ORGASUXHOME=$0:h
set ORGASUXHOME=`(chdir "${ORGASUXHOME}"; chdir ..; pwd)`
echo "ORGASUXHOME='${ORGASUXHOME}'"

###============================================

foreach FLDR ( $PROJECTS )

	if ( -e "${FLDR}" ) then
		chdir "${FLDR}"
		pwd
		if ( -e pom.xml ) then
			set GroupID=`grep '<groupId>' pom.xml | head -1 | sed 's|.*<groupId>\(..*\)</groupId>.*|\1|'`
			set ArtifactId=`grep '<artifactId>' pom.xml | head -1 | sed 's|.*<artifactId>\(..*\)</artifactId>.*|\1|'`
			set Version=`grep '<version>' pom.xml | head -1 | sed 's|.*<version>\(..*\)</version>.*|\1|'`
			set SRC="${ORGASUXMVNREPOHOME}/${ArtifactId}/${Version}/${ArtifactId}-${Version}.jar"
			set DEST="${ORGASUXHOME}/lib/${GroupID}.${ArtifactId}.${ArtifactId}-${Version}.jar"
			ls -lad "${SRC}"
			ls -lad "${DEST}"
			if ( -e "${SRC}" ) mv -i "${SRC}"  "${DEST}"
			ls -lad "${DEST}"
		endif

		if ( $status == 0 || $?IGNOREERRORS ) then
			### Do nothing
		else
			pwd
			exit $status
		endif

	else
		echo ".. ${FLDR}  ... No-Such folder \!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\ .."
	endif

end

#EoScript
