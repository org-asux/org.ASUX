#!/bin/tcsh -f

alias CHDIR "if ( -e \!* ) chdir \!* "

chdir /mnt/development/src/org.ASUX/org.ASUX.common
mvn clean compiler:compile jar:jar install:install $*

if ( $status == 0 || $#argv > 0 ) then
	chdir /mnt/development/src/org.ASUX/org.ASUX.YAML
	mvn clean compiler:compile jar:jar install:install $*

	if ( $status == 0 || $#argv > 0 ) then
		chdir /mnt/development/src/org.ASUX/org.ASUX.YAML.NodeImpl
		mvn clean compiler:compile jar:jar install:install $*

		if ( $status == 0 || $#argv > 0 ) then
			CHDIR /mnt/development/src/org.ASUX/AWS-SDK
			CHDIR /mnt/development/src/org.ASUX/org.ASUX.AWS-SDK
			mvn clean compiler:compile jar:jar install:install $*

			if ( $status == 0 || $#argv > 0 ) then
				CHDIR /mnt/development/src/org.ASUX/AWS/CFN
				CHDIR /mnt/development/src/org.ASUX/org.ASUX.AWS.CFN
				mvn clean compiler:compile jar:jar install:install $*
			endif
		endif
	endif
endif
