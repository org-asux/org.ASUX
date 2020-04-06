
*	Create an EC2 instance
*	git clone https://github.com/org-asux/org.ASUX.git
*	cd org.ASUX
*	./install
### Note: You have to install - to get Node.JS and JS running.. TO RUN TESTING !!!

###---------------------------------------------
###=============================================
###---------------------------------------------

*	.  bin/installNodeOnAWSEC2Instance.sh
* 	bin/downloadAll.csh
*	bin/compileAll.csh
*	bin/testAllProjects.csh

###---------------------------------------------
###=============================================
###---------------------------------------------

*	bin/jarCopyForAllProjects.csh
### Follow Microsoft OneNotes notes - to setup git ( to do git push)
*	git push; git commit -m 'CHORE: latest compile' ... ...


###---------------------------------------------
###=============================================
###---------------------------------------------

### See MAVEN notes within Microsoft OneNote on how to setup GPG Key & ~/.m2/settings.xml
*	cd into each JAVA project
*	mvn -f pom-MavenCentralRepo.xml deploy


#EoF
