# zkProof Of Buffiness - ETH Denver 2021

https://zkbuffi.web.app/

Proof that you belong to the select group of Bufficorns owners without revealing witch Buffi is yours nor which is your address.

<p align="center">
  <img src="https://user-images.githubusercontent.com/45073251/154821162-3d4af844-1f74-4fdb-91c3-52e280e55c10.png"/>
</p>

### Mobile first

<p align="center">
  <img src="https://user-images.githubusercontent.com/45073251/154821939-e0df5284-d4d1-4b50-8e1e-8b1b06b34855.png"/>
</p>

### Implemented using SnarkJs and Circom circuit compiler.

SNARKJS > https://github.com/iden3/snarkjs

CIRCOM LIB > https://github.com/iden3/circomlib

### Requirements
```
# RUST (how to install rust)
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
git clone https://github.com/iden3/circom.git
cd circom
cargo build  --release
cargo install --path circom

# snarkjs
npm install -g snarkjs


```

### Development Scripts
```
 sh run_all.sh
 sh collect_static.sh
```

### Start Dapp locally
```
cd dapp
npm i
npm run start
```

### Inspired by some awesome ETH DENVER folks:
* https://www.twitch.tv/videos/1300382536
* And many more...
