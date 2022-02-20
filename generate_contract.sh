#!/bin/bash
set -eux
# -e  exit script if one command fails
# -x  Print commands and their arguments as they are executed
# -u  The shell will write a message to standard error when it tries to expand a variable that is not set and exit

##############################################################
# Generate contract script                                   #
##############################################################

# [optional] Generate (ready to deploy) verification solidity contract code
snarkjs zkey export solidityverifier buffi.zkey buffi_verifier.sol
