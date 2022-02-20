#!/bin/bash
set -eux
# -e  exit script if one command fails
# -x  Print commands and their arguments as they are executed
# -u  The shell will write a message to standard error when it tries to expand a variable that is not set and exit

##############################################################
# Collect all zk statics and deploy it on /dapp/src/zkLibs   #
##############################################################

mkdir -p ./dapp/public/zkLibs/
cp -R ./buffi_js ./dapp/public/zkLibs/
cp ./buffi.zkey ./dapp/public/
mv ./dapp/public/zkLibs/buffi_js/buffi.wasm ./dapp/public/buffi.wasm
#cp ./buffi_inputs.json ./dapp/public/zkLibs/
#cp ./powersOfTau28_hez_final_12.ptau ./dapp/public/zkLibs/
