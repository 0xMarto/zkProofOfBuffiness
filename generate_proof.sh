#!/bin/bash
set -eux
# -e  exit script if one command fails
# -x  Print commands and their arguments as they are executed
# -u  The shell will write a message to standard error when it tries to expand a variable that is not set and exit

##############################################################
# Create Proof Generator                                     #
##############################################################

# Show inputs
cat buffi_inputs.json

# Generate whitness (aka circuits inputs)
node buffi_js/generate_witness.js buffi_js/buffi.wasm buffi_inputs.json buffi_witness.wtns

# [optional] Convert witness binary to json
snarkjs wtns export json buffi_witness.wtns buffi_witness.json

# [only once] Download "power of tau" ceremony
wget -c -N https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau

# Init PLONK trusted setup
snarkjs plonk setup buffi.r1cs powersOfTau28_hez_final_12.ptau buffi.zkey

# Generate verification key in json
snarkjs zkey export verificationkey buffi.zkey buffi_verification_key.json

# Generate zkProof
snarkjs plonk prove buffi.zkey buffi_witness.wtns buffi_proof.json buffi_outputs.json

# Convert calculated outputs into hex call data
snarkjs zkey export soliditycalldata buffi_outputs.json buffi_proof.json > buffi_proof.calldata

# Show outputs
cat buffi_outputs.json

