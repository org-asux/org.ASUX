#!/bin/tcsh -f

alias CHDIR "if ( -e \!* ) chdir \!* "

chdir /mnt/development/src/org.ASUX/org.ASUX.common
pwd
git status

if ( $status == 0 || $#argv > 0 ) then
	echo -n '... '; set ANS=$<
	chdir /mnt/development/src/org.ASUX/org.ASUX.YAML
	pwd
	git status

	if ( $status == 0 || $#argv > 0 ) then
		echo -n '... '; set ANS=$<
		chdir /mnt/development/src/org.ASUX/org.ASUX.YAML.NodeImpl
		pwd
		git status

		if ( $status == 0 || $#argv > 0 ) then
			echo -n '... '; set ANS=$<
			CHDIR /mnt/development/src/org.ASUX/AWS-SDK
			CHDIR /mnt/development/src/org.ASUX/org.ASUX.AWS-SDK
			pwd
			git status

			if ( $status == 0 || $#argv > 0 ) then
				echo -n '... '; set ANS=$<
				CHDIR /mnt/development/src/org.ASUX/AWS/CFN
				CHDIR /mnt/development/src/org.ASUX/org.ASUX.AWS.CFN
				pwd
				git status

				if ( $status == 0 || $#argv > 0 ) then
					echo -n '... '; set ANS=$<
					chdir /mnt/development/src/org.ASUX
					pwd
					git status

				endif
			endif
		endif
	endif
endif
