#!/bin/bash
set -eux
# -e  exit script if one command fails
# -x  Print commands and their arguments as they are executed
# -u  The shell will write a message to standard error when it tries to expand a variable that is not set and exit

##############################################################
# Run all scripts                                            #
##############################################################

sh compile_circuit.sh
sh generate_proof.sh
sh generate_contract.sh
sh verify_proof.sh
