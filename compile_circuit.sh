#!/bin/bash
set -eux
# -e  exit script if one command fails
# -x  Print commands and their arguments as they are executed
# -u  The shell will write a message to standard error when it tries to expand a variable that is not set and exit

##############################################################
# Compile Circuit                                            #
##############################################################

# Generate js script to create witness
circom buffi.cicom --r1cs --wasm --sym --c

# [optional] Show compiled circuit general data
snarkjs r1cs info buffi.r1cs 

# [optional] Show circuit calculated constrains equations
snarkjs r1cs print buffi.r1cs buffi.sym
