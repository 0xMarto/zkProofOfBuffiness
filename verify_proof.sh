#!/bin/bash
set -eux
# -e  exit script if one command fails
# -x  Print commands and their arguments as they are executed
# -u  The shell will write a message to standard error when it tries to expand a variable that is not set and exit

##############################################################
# Verify Proof scripts                                       #
##############################################################


# Verify zkProof
snarkjs plonk verify buffi_verification_key.json buffi_outputs.json buffi_proof.json

