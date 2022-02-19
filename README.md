# zkProof Of Buffiness - ETH Denver 2021

https://zkbuffi.web.app/


## Vision

Hi anon, join us at ZKPoB and prove that you are a Bufficorn without revealing anything about yourself other than your Buffiness
## Description

zkPoB is a mobile compatible tool that lets anyone prove they own a Bufficorn (or any NFT) without revealing which Buffi they own or the address they are verifying themselves with


<p align="center">
  <img src="https://user-images.githubusercontent.com/45073251/154821162-3d4af844-1f74-4fdb-91c3-52e280e55c10.png"/>
</p>

### Mobile first

<p align="center">
  <img src="https://user-images.githubusercontent.com/45073251/154821939-e0df5284-d4d1-4b50-8e1e-8b1b06b34855.png"/>
</p>

## Authors

👤 **Agustin Zavalla** - https://github.com/martinlsanchez

👤 **Emilio Garcia** - https://github.com/danielemiliogarcia

👤 **Jose Baredes** - https://github.com/azavalla

👤 **Martin Sanchez** - https://github.com/josebaredes


## Implemented using SnarkJs and Circom circuit compiler.

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
