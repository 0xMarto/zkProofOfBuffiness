# zkProof Of Buffiness - ETH Denver 2021

Live demo --> https://zkbuffi.web.app/

<p align="center">
  <img src="https://user-images.githubusercontent.com/45073251/154821162-3d4af844-1f74-4fdb-91c3-52e280e55c10.png"/>
</p>

## Vision

Hi anon, join us at ZKPoB and prove that you are a Bufficorn without revealing anything about yourself other than your Buffiness
## Description

zkPoB is a mobile compatible tool that lets anyone prove they own a Bufficorn (or any NFT) without revealing which Buffi they own or the address they are verifying themselves with

## Mobile first

<p align="center">
  <img src="https://user-images.githubusercontent.com/45073251/154821939-e0df5284-d4d1-4b50-8e1e-8b1b06b34855.png"/>
</p>

## How it works

Let's say you want to organize an event in which only a set of addresses can participate (for ETH Denver we will use the set of addresses that own a Bufficorn). When a guest arrives you must check that they were invited (ie. their address owns at least one Bufficorn)... but your guests are a bunch of anons that do not want to reveal their address or any data that may point to their address, such as an NFT number (Bufficorn holders love privacy).

Sounds like a bit difficult, or almost impossible... but.. here is where we can use ZKProofs.

With ZKPoB, the host can sign a set of messages with their private key. The messages consist of a tuple (address, event_id) that lists the addresses that can attend the event with the host's signature... (kind of taking an snapshot at certain block of all the Bufficorn holders).

ZKPoB will construct a circom circuit that will take the following inputs:
1) the guests' addresses and event id signed by the host previously chosen from the pre-computed set;
2) any message signed by the guest.

The circuit will:
1) verify that the host signature is valid, obtaining a guest address and the event id;
2) check that the event id is for the aforementioned event;
3) verify the guest's signed message therefore verifying the guest's address;
4) check that guest address obtained in 1, and the guest address obtained in 3 are equal.

The circuit output will be:
1) True if the circuit conditions are met;
2) A valid ZKProof, proving that the guest is in!

* Note: the circuit will fail and will not be able to generate a proof if the guest is not a Bufficorn holder.

ZKPoB will also generate a verifier and deploy a contract to the blockchain.

Guests can browse the host's site and generate a proof of buffiness, storing it as a QR code in their mobile device.

When a guest arrives at the event, a doorman can verify the proof by reading the QR code containing the proof and calling the verifier contract through a mobile app. If the verification succeeds, the guest can go in without disclosing any information about them.

The app will also save in a list the already verified proofs to avoid a "double spend" (ie. two or more guests going in using the same proof).

* Note: If a malicious guest generates a proof and then transfers his Bufficorn to a another address, they will not be able to cheat, as the snapshot taken by the host maps only one address per Bufficorn.

## Authors

👤 **Agustin Zavalla** - https://github.com/azavalla

👤 **Emilio Garcia** - https://github.com/danielemiliogarcia

👤 **Jose Baredes** - https://github.com/josebaredes

👤 **Martin Sanchez** - https://github.com/martinlsanchez


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


## Disclosure

The circuit described in this ReadMe is slightly different than the one applied in the app, as we had only 48 hours to build it :).

The circuit used in the app is a simplified version of the one described as the mobile app currently performs a few of the checks that would be performed by the circuit.

However, it should not take us that much longer to implement the full circuit in the future!
## Show your support

Give a ⭐️ if you like this project!
