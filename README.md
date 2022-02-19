# zkProof Of Buffiness

Simple implementation of zkProofs that let you proof that you belong to the select group of Bufficorns owners without revealing witch Buffi is yours or what is your address.

Implemented using SnarkJs and Circom circuit compiler. 

SNARKJS > https://github.com/iden3/snarkjs

CIRCOM LIB > https://github.com/iden3/circomlib

### Requirements
```
# RUST (how to install rust)
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
git clone https://github.com/iden3/circom.git
cd circom
cargo build  --release
corgo install --path circom
```

### Development Scripts
```
 sh run_all.sh 
 sh collect_static.sh
```

###Inspired by some awesome ETH DENVER folks:
* https://www.twitch.tv/videos/1300382536
* And many more...
