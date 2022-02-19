import {
    Box,
    Button,
    ChakraProvider,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Spacer,
    Stack,
    Text,
    useBreakpointValue,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import "@fontsource/inter";
import React, { useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import {
    encrypt,
    recoverPersonalSignature,
    recoverTypedSignatureLegacy,
    recoverTypedSignature,
    recoverTypedSignature_v4 as recoverTypedSignatureV4,
} from 'eth-sig-util';
import { toChecksumAddress } from 'ethereumjs-util';
import { BigNumber } from "ethers";
import { QrReader } from 'react-qr-reader';

const snarkjs = require("snarkjs");
var QRCode = require('qrcode.react');


type MyProps = {};
type MyState = { role: string, signed: string, proofUrl: string };

class App extends React.Component<MyProps, MyState> {
    constructor(props: any) {
        super(props);
        this.state = {
            role: null,
            signed: null,
            proofUrl: null
        };
    }

    render() {
        console.log('role', this.state.role)

        return (
            <ChakraProvider theme={theme}>
                <Flex
                    w={'full'}
                    h={'100vh'}
                    backgroundImage={
                        // TODO serve from public
                        // 'url(https://lh3.googleusercontent.com/nSE1ruQ-llGsg-tcl_cujSDQnHi9z-0AdLIJMmMhTZwOhF6WkRR44txmHIofZXmwpSqn0MNTA1LAVjzlU4s6fwUS719onAiPDT-P9g=s0)'
                        'url(buffi.png)'
                        // 'url(public/buffi.png)'
                    }
                    backgroundSize={'cover'}
                    backgroundPosition={'center center'}>

                    <Box
                        w={'full'}
                        px={10}
                        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
                    >
                        <Header/>
                        <VStack
                            w={'full'}
                            justify={'center'}
                            px={10}
                            // bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
                        >
                            <Text
                                color={'white'}
                                paddingRight='140px'
                                margin={'50px'}
                                fontWeight={700}
                                lineHeight={1.2}
                                fontSize={30}>
                                Proof of buffiness
                            </Text>
                            <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>

                                {
                                    !this.state.role
                                        ?
                                        <Stack direction={'row'}>
                                            <Button
                                                bg={'black'}
                                                rounded={'full'}
                                                color={'white'}
                                                onClick={() => this.setState({role: 'owner'})}
                                                _hover={{bg: 'black'}}>
                                                I own a bufficorn
                                            </Button>
                                            <Button
                                                bg={'whiteAlpha.300'}
                                                rounded={'full'}
                                                color={'white'}
                                                onClick={() => this.setState({role: 'doorman'})}
                                                _hover={{bg: 'whiteAlpha.500'}}>
                                                I'm the doorman
                                            </Button>
                                        </Stack>

                                        :
                                        this.state.role === 'owner'
                                            ?
                                            <Container id="verify-container">
                                                <Button
                                                    bg={'black'}
                                                    rounded={'full'}
                                                    color={'white'}
                                                    onClick={() => this._signMessage()}
                                                    _hover={{bg: 'black'}}>
                                                    Generate proof
                                                </Button>
                                                <Box marginTop={'20px'}>
                                                    Signed: {this.state.signed ? this.state.signed.substring(1, 10) : null}
                                                </Box>

                                                {/* {
                                                    this.state.signed
                                                        ?
                                                        <Container id="proof-container">
                                                            <Button
                                                                bg={'black'}
                                                                rounded={'full'}
                                                                color={'white'}
                                                                onClick={() => this._verifyMessage()}
                                                                _hover={{bg: 'black'}}>
                                                                recover signer
                                                            </Button>
                                                            <QRCode value="https://vitalik.ca/"/>
                                                        </Container>
                                                        :
                                                        null
                                                } */}

                                                {
                                                  this.state.proofUrl ?
                                                    <QRCode value={this.state.proofUrl}/>
                                                  :
                                                    null
                                                }
                                            </Container>
                                            :
                                            // <Button
                                            //     bg={'whiteAlpha.300'}
                                            //     rounded={'full'}
                                            //     color={'white'}
                                            //     onClick={() => this.setState({role: 'doorman'})}
                                            //     _hover={{bg: 'whiteAlpha.500'}}>
                                            //     Verify
                                            // </Button>
                                              <TestQR />
                                }
                            </Stack>
                        </VStack>
                    </Box>
                </Flex>
            </ChakraProvider>
        );
    }

    async _signMessage() {
        console.log('Signing message!')

        const provider: any = await detectEthereumProvider();
        let accounts

        if (provider) {
          console.log('got provider!')
          console.log(provider); // initialize your app
          accounts = await provider.request({method: 'eth_requestAccounts'});
          console.log('accounts', accounts)
        } else {
          console.log('Please install MetaMask!');
          return
        }

        try {
          const from = accounts[0]
          const chainId = await provider.request({method: 'eth_chainId'})
          console.log('chainId', chainId)
          const networkId = await provider.request({method: 'net_version'})
          console.log('networkId', networkId)
          const msgParams: any = {
              domain: {
                  chainId: chainId.toString(),
                  name: 'Ether Mail',
                  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
                  version: '1',
              },
              message: {
                  contents: 'Hello, Bob!',
                  from: {
                      name: 'Cow',
                      wallets: [
                          '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
                          '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
                      ],
                  },
                  to: [
                      {
                          name: 'Bob',
                          wallets: [
                              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                              '0xB0B0b0b0b0b0B000000000000000000000000000',
                          ],
                      },
                  ],
              },
              primaryType: 'Mail',
              types: {
                  EIP712Domain: [
                      {name: 'name', type: 'string'},
                      {name: 'version', type: 'string'},
                      {name: 'chainId', type: 'uint256'},
                      {name: 'verifyingContract', type: 'address'},
                  ],
                  Group: [
                      {name: 'name', type: 'string'},
                      {name: 'members', type: 'Person[]'},
                  ],
                  Mail: [
                      {name: 'from', type: 'Person'},
                      {name: 'to', type: 'Person[]'},
                      {name: 'contents', type: 'string'},
                  ],
                  Person: [
                      {name: 'name', type: 'string'},
                      {name: 'wallets', type: 'address[]'},
                  ],
              },
          };
          const signed = await provider.request({
              method: 'eth_signTypedData_v4',
              params: [from, JSON.stringify(msgParams)],
          });
          console.log('signed', signed)

          // this.setState({signed: signed})
          // signTypedDataV4Result.innerHTML = sign;
          // signTypedDataV4Verify.disabled = false;

          // Recover signed msg
          const recoveredAddr = recoverTypedSignatureV4({
              data: msgParams,
              sig: signed,
          });
          if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
              console.log(`Successfully verified signer as ${recoveredAddr}`);
              // signTypedDataV4VerifyResult.innerHTML = recoveredAddr;
          } else {
              console.log(
                  `Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
              );
          }

          // Cast address to bigint so our circuit can generate the proof
          console.log('big', BigInt(recoveredAddr))
          const buffiInputs = { 'a': 1 }
          // const buffiInputs = { 'a': 2 }
          // const buffiInputs = { 'a': BigInt(recoveredAddr) }
          // const buffiInputs = { 'a': BigNumber.from(recoveredAddr) }


          // Generate zk proof
          // const buffiInputs = {'a': 1};
          // const circuit = process.env.PUBLIC_URL + '/public/zkLibs/buffi_js/buffi.wasm'
          const circuit = process.env.PUBLIC_URL + 'buffi.wasm'
          console.log(circuit)
          // const circuit_key = process.env.PUBLIC_URL + '/public/zkLibs/buffi.zkey'
          const circuit_key = process.env.PUBLIC_URL + 'buffi.zkey'
          console.log(circuit_key)
          // const { proof, buffi_outputs } = await snarkjs.plonk.fullProve(buffiInputs, circuit, circuit_key);
          const res = await fetch('buffi.wasm')
          const res2 = await fetch('buffi.zkey')
          console.log('res', res)
          console.log('res2', res2)
          const buffer = await res.arrayBuffer()
          const buffer2 = await res2.arrayBuffer()
          console.log('buffer', buffer)
          console.log('buffer2', buffer2)
          const { proof, publicSignals } = await snarkjs.plonk.fullProve(buffiInputs, circuit, circuit_key);
          console.log('Proof:', proof);
          console.log('Str Proof:', JSON.stringify(proof));
          console.log('publicSignals:', publicSignals);
          // console.log('hex encoded proof', hexEncode(JSON.stringify(proof)))

          const solidityCallData = await snarkjs.plonk.exportSolidityCallData(proof, publicSignals)
          console.log('solidityCallData', solidityCallData)
          const solidityCalldataProof = solidityCallData.split(',')[0]
          console.log('solidityCalldataProof', solidityCalldataProof)

          const response = await fetch("https://api.tinyurl.com/create", {
            body: JSON.stringify({
                // url: "zkbuffi.web.app/verify/" + hexEncode(JSON.stringify(proof).substring(0, 10)),
                url: "zkbuffi.web.app/verify/" + solidityCalldataProof,
                domain: "tiny.one"
            }),
            headers: {
                Accept: "application/json",
                Authorization: "Bearer hy7heS5lDT28kQOCLhO9vmcSqZhrVNF7k1GgjA0p0RPI4Zq7ixEduEJEBhQ3",
                "Content-Type": "application/json"
            },
            method: "POST"
          })
          // .then(response => response.json())
          // .then(data => console.log('data', data.data.tiny_url))
          // .catch(error => console.log('error', error))

          console.log('response', response)
          const jsonResponse = await response.json()
          console.log('jsonResponse', jsonResponse)

          this.setState({proofUrl: jsonResponse.data.tiny_url})
          

        } catch (err) {
            console.error('got error :(', err);
            // signTypedDataV4Result.innerHTML = `Error: ${err.message}`;
        }
    }

    async _verifyMessage() {
        const provider: any = await detectEthereumProvider();
        let accounts

        if (provider) {
            console.log('got provider!')
            console.log(provider); // initialize your app
            accounts = await provider.request({method: 'eth_requestAccounts'});
            console.log('accounts', accounts)
        } else {
            console.log('Please install MetaMask!');
            return
        }

        const from = accounts[0]
        const chainId = await provider.request({method: 'eth_chainId'})
        console.log('chainId', chainId)
        const networkId = await provider.request({method: 'net_version'})
        console.log('networkId', networkId)
        const msgParams: any = {
            domain: {
                chainId,
                name: 'Ether Mail',
                verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
                version: '1',
            },
            message: {
                contents: 'Hello, Bob!',
                from: {
                    name: 'Cow',
                    wallets: [
                        '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
                        '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
                    ],
                },
                to: [
                    {
                        name: 'Bob',
                        wallets: [
                            '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                            '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                            '0xB0B0b0b0b0b0B000000000000000000000000000',
                        ],
                    },
                ],
            },
            primaryType: 'Mail',
            types: {
                EIP712Domain: [
                    {name: 'name', type: 'string'},
                    {name: 'version', type: 'string'},
                    {name: 'chainId', type: 'uint256'},
                    {name: 'verifyingContract', type: 'address'},
                ],
                Group: [
                    {name: 'name', type: 'string'},
                    {name: 'members', type: 'Person[]'},
                ],
                Mail: [
                    {name: 'from', type: 'Person'},
                    {name: 'to', type: 'Person[]'},
                    {name: 'contents', type: 'string'},
                ],
                Person: [
                    {name: 'name', type: 'string'},
                    {name: 'wallets', type: 'address[]'},
                ],
            },
        };
        try {
            const from = accounts[0];
            const signed = this.state.signed;
            console.log('recovering', signed)
            const recoveredAddr = recoverTypedSignatureV4({
                data: msgParams,
                sig: signed,
            });
            if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
                console.log(`Successfully verified signer as ${recoveredAddr}`);
                // signTypedDataV4VerifyResult.innerHTML = recoveredAddr;
            } else {
                console.log(
                    `Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
                );
            }
        } catch (err) {
            console.error(err);
            // signTypedDataV4VerifyResult.innerHTML = `Error: ${err.message}`;
        }

    }
}


function Owner() {
    const {isOpen, onOpen, onClose} = useDisclosure();

    return <Box h='100'>
        <ConnectButton handleOpenModal={onOpen}/>
        <AccountModal isOpen={isOpen} onClose={onClose}/>
    </Box>
}

function Header() {
    // return <Stack align={'flex-end'}>
    //   <ConnectButton handleOpenModal={onOpen} />
    //   <AccountModal isOpen={isOpen} onClose={onClose} />
    // </Stack>

    return <Flex marginTop='10px'>
        <Box p='2'>
            <Heading
                size='md'
                color={'white'}
                // margin='10px'
                // paddingTop='10px'
            >
                zkPoB
            </Heading>
        </Box>
        <Spacer/>
        <Owner/>
    </Flex>
}

const TestQR = (props: any) => {
  const [data, setData] = useState('No result');

  console.log('data', data)

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        // style={{ width: '100%' }}
        // constraints={{ width: '100%' as ConstrainULong }}
        constraints={{}}
      />
      <p>{data}</p>
    </>
  );
};

function hexEncode(str: string) {
  var hex, i;

  var result = "";
  for (i=0; i < str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += ("000"+hex).slice(-4);
  }

  return result
}

export default App
