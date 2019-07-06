#!/bin/tcsh -f

alias CHDIR "if ( -e \!* ) chdir \!* "

chdir /mnt/development/src/org.ASUX/org.ASUX.common
./test/testall.csh

if ( $status == 0 || $#argv > 0 ) then
	chdir /mnt/development/src/org.ASUX/org.ASUX.YAML
	## No testing in here.

	if ( $status == 0 || $#argv > 0 ) then
		chdir /mnt/development/src/org.ASUX/org.ASUX.YAML.NodeImpl
		## No testing in here.

		if ( $status == 0 || $#argv > 0 ) then
			chdir /mnt/development/src/org.ASUX
			./test/testall.csh

			if ( $status == 0 || $#argv > 0 ) then
				CHDIR /mnt/development/src/org.ASUX/AWS-SDK
				CHDIR /mnt/development/src/org.ASUX/org.ASUX.AWS-SDK
				./test/testall.csh

				if ( $status == 0 || $#argv > 0 ) then
					CHDIR /mnt/development/src/org.ASUX/AWS/CFN
					CHDIR /mnt/development/src/org.ASUX/org.ASUX.AWS.CFN
					./test/testall.csh
				endif
			endif
		endif
	endif
endif
