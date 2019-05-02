#!/bin/bash

echo ''; echo ''; echo ''
echo .. you must run this command as follows:-
echo 'NO NEED NO NEED NO NEED NO NEED --> sudo -i'
echo ''; echo ''; echo ''
echo '> cd ~'
echo ''; echo ' VERY IMPORTANT.  VERY IMPORTANT. VERY IMPORTANT.  You must be in your HOME folder'; echo ''
echo "> ./$0"
read -p "CONFIRM all of the above (#1): "  Variable
read -p "CONFIRM all of the above (#2): "  Variable
read -p "CONFIRM all of the above (#3): "  Variable

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 7
