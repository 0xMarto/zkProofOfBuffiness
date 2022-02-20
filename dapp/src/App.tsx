import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Checkbox,
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
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const snarkjs = require("snarkjs");
var QRCode = require('qrcode.react');


type MyProps = {};
type MyState = { 
  role: string,
  signed: string,
  proofUrl: string,
  qrData: string,
  verificationOk: boolean,
  duplicated: boolean,
};

class App extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      role: null,
      signed: null,
      proofUrl: null,
      qrData: null,
      verificationOk: null,
      duplicated: null
    };

    // this.qrHandler = this.qrHandler.bind(this)
    if (!window.localStorage.attendees)
      window.localStorage.setItem('attendees', '0')
  }

  async componentDidMount() {
    if (window.location.pathname.startsWith('/verify')) {
      this.setState({ role: 'doorman' })
      window.localStorage.setItem('attendees', (Number(window.localStorage.getItem('attendees')) + 1).toString())
      console.log('window.location.pathname', window.location.pathname)
      const proof = window.location.pathname.replace('/verify/', '')
      console.log('proof', proof)

      // Did we check this QR already?
      const oldProof = window.localStorage.getItem(proof)
      if (!oldProof) {
        window.localStorage.setItem(proof, 'true')
        await this.verifyProof(proof)
      } else {
        console.log('Already checked-in :_(')
        this.setState({ duplicated: true })
      }
    }
  }

  async verifyProof(proof: any) {
    console.log(proof)

    const vkey = await fetch('/buffi_verification_key.json', {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer hy7heS5lDT28kQOCLhO9vmcSqZhrVNF7k1GgjA0p0RPI4Zq7ixEduEJEBhQ3",
        "Content-Type": "application/json"
      }
    })
    console.log('vkey', vkey)
    const json = await vkey.json()
    console.log('json', json)

    // Mock verification, for now
    // await snarkjs.plonk.verify(json, 1, proof)
    const ok = this.mockVerifyProof(proof)
    console.log('ok?', ok, typeof ok)
    this.setState({ verificationOk: ok })
  }

  mockVerifyProof(proof: any) {
    return Math.random() > 0.5
  }

  // async qrHandler(data: string) {
  //   console.log('data', data)
  //   const response = await fetch(data, {
  //     mode: 'no-cors' // 'cors' by default
  //   })
  //   console.log('response', response)
  //   // this.setState({
  //   //   qrData: data
  //   // })
  // }

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
            // 'url(buffi.png)'
            'https://zkbuffi.web.app/buffi.png'
          }
          backgroundSize={'cover'}
          backgroundPosition={'center center'}>

          <Box
            w={'full'}
            px={10}
            bgGradient={'linear(to-r, blackAlpha.900, transparent)'}
          >
            <Header />
            <VStack
              w={'full'}
              justify={'center'}
            // px={100}
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
                        bg={'whiteAlpha.300'}
                        rounded={'full'}
                        color={'white'}
                        onClick={() => this.setState({ role: 'owner' })}
                        _hover={{ bg: 'whiteAlpha.500' }}>
                          I own a bufficorn
                      </Button>
                      <Button
                        bg={'black'}
                        rounded={'full'}
                        color={'white'}
                        onClick={() => this.setState({ role: 'doorman' })}
                        _hover={{ bg: 'black' }}>
                        I'm the doorman
                      </Button>
                    </Stack>

                    :
                    this.state.role === 'owner'
                      ?
                      <Container id="verify-container">
                        <Text
                          color={'white'}
                          // paddingRight='10px'
                          margin={'5px'}
                          fontWeight={700}
                          lineHeight={1.4}
                          fontSize={'3vh'}>
                          Uh-huh... you're a buffi owner... says you
                        </Text>
                        <Text
                          color={'white'}
                          // paddingRight='10px'
                          margin={'5px'}
                          fontWeight={700}
                          lineHeight={1.4}
                          fontSize={'3vh'}>
                          So you shouldn't have any trouble proving it!
                        </Text>
                        <Button
                          // height={'11'}
                          margin={5}
                          bg={'black'}
                          rounded={'full'}
                          color={'white'}
                          onClick={() => this._signMessage()}
                          _hover={{ bg: 'black' }}
                        >
                          <Text
                            // fontWeight={700}
                            fontSize={20}
                          >
                            Generate proof
                          </Text>
                        </Button>

                        {
                          this.state.proofUrl ?
                            <Container margin={5}>
                              <QRCode value={this.state.proofUrl} />
                            </Container>
                            :
                            null
                        }
                      </Container>
                      :
                      <Container>
                        <Text
                          color={'white'}
                          margin={'40px'}
                          fontWeight={700}
                          lineHeight={1.2}
                          fontSize={20}>
                          Well hello, Mr. Doorman
                        </Text>
                        <Text
                          color={'white'}
                          margin={'40px'}
                          fontWeight={700}
                          lineHeight={1.2}
                          fontSize={20}>
                          You have checked in a total of {window.localStorage.getItem('attendees')} attendees
                        </Text>
                        <Center>
                          <VStack>
                            {
                              this.state.verificationOk ?
                              <CheckIcon  w={12} h={12} color='green.500'/>
                              :
                              <CloseIcon  w={12} h={12} color='red.500'/>
                            }
                            {
                              this.state.duplicated ?
                                <Text
                                  color={'white'}
                                  margin={'10px'}
                                  fontWeight={400}
                                  lineHeight={1.2}
                                  fontSize={18}
                                >
                                  Already checked in
                                </Text>
                              :
                              null
                            }
                          </VStack>
                        </Center>

                      </Container>
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
      accounts = await provider.request({ method: 'eth_requestAccounts' });
      console.log('accounts', accounts)
    } else {
      console.log('Please install MetaMask!');
      return
    }

    try {
      const from = accounts[0]
      const chainId = await provider.request({ method: 'eth_chainId' })
      console.log('chainId', chainId)
      const networkId = await provider.request({ method: 'net_version' })
      console.log('networkId', networkId)
      const msgParams: any = {
        domain: {
          chainId: chainId.toString(),
          name: 'Welcome, anon',
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          version: '1',
        },
        message: {
          contents: 'Sign a message so we can proove this is really your address. Don\'t worry, neither your address nor your buffi holdings will ever be shared with zkbuffi (or anyone else).'
        },
        primaryType: 'Mail',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Group: [
            { name: 'name', type: 'string' },
            { name: 'members', type: 'Person[]' },
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person[]' },
            { name: 'contents', type: 'string' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallets', type: 'address[]' },
          ],
        },
      };
      const signed = await provider.request({
        method: 'eth_signTypedData_v3',
        params: [from, JSON.stringify(msgParams)],
      });
      console.log('signed', signed)

      // Recover signed msg
      const recoveredAddr = recoverTypedSignature({
        data: msgParams,
        sig: signed,
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
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
      // const res = await fetch('buffi.wasm')
      // const res2 = await fetch('buffi.zkey')
      // console.log('res', res)
      // console.log('res2', res2)
      // const buffer = await res.arrayBuffer()
      // const buffer2 = await res2.arrayBuffer()
      // console.log('buffer', buffer)
      // console.log('buffer2', buffer2)
      console.log('I will try to make the proof')
      console.log('inputs are', buffiInputs, circuit, circuit_key)
      console.log('typeof inputs', typeof buffiInputs, typeof circuit, typeof circuit_key)
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

      this.setState({ proofUrl: jsonResponse.data.tiny_url })
    } catch (err) {
      console.error('got error :(', err);
      // signTypedDataV4Result.innerHTML = `Error: ${err.message}`;
    }
  }

  // async _verifyMessage() {
  //     const provider: any = await detectEthereumProvider();
  //     let accounts

  //     if (provider) {
  //         console.log('got provider!')
  //         console.log(provider); // initialize your app
  //         accounts = await provider.request({method: 'eth_requestAccounts'});
  //         console.log('accounts', accounts)
  //     } else {
  //         console.log('Please install MetaMask!');
  //         return
  //     }

  //     const from = accounts[0]
  //     const chainId = await provider.request({method: 'eth_chainId'})
  //     console.log('chainId', chainId)
  //     const networkId = await provider.request({method: 'net_version'})
  //     console.log('networkId', networkId)
  //     const msgParams: any = {
  //         domain: {
  //             chainId,
  //             name: 'Ether Mail',
  //             verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  //             version: '1',
  //         },
  //         message: {
  //             contents: 'Hello, Bob!',
  //             from: {
  //                 name: 'Cow',
  //                 wallets: [
  //                     '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
  //                     '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
  //                 ],
  //             },
  //             to: [
  //                 {
  //                     name: 'Bob',
  //                     wallets: [
  //                         '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  //                         '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
  //                         '0xB0B0b0b0b0b0B000000000000000000000000000',
  //                     ],
  //                 },
  //             ],
  //         },
  //         primaryType: 'Mail',
  //         types: {
  //             EIP712Domain: [
  //                 {name: 'name', type: 'string'},
  //                 {name: 'version', type: 'string'},
  //                 {name: 'chainId', type: 'uint256'},
  //                 {name: 'verifyingContract', type: 'address'},
  //             ],
  //             Group: [
  //                 {name: 'name', type: 'string'},
  //                 {name: 'members', type: 'Person[]'},
  //             ],
  //             Mail: [
  //                 {name: 'from', type: 'Person'},
  //                 {name: 'to', type: 'Person[]'},
  //                 {name: 'contents', type: 'string'},
  //             ],
  //             Person: [
  //                 {name: 'name', type: 'string'},
  //                 {name: 'wallets', type: 'address[]'},
  //             ],
  //         },
  //     };
  //     try {
  //         const from = accounts[0];
  //         const signed = this.state.signed;
  //         console.log('recovering', signed)
  //         const recoveredAddr = recoverTypedSignatureV4({
  //             data: msgParams,
  //             sig: signed,
  //         });
  //         if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
  //             console.log(`Successfully verified signer as ${recoveredAddr}`);
  //             // signTypedDataV4VerifyResult.innerHTML = recoveredAddr;
  //         } else {
  //             console.log(
  //                 `Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
  //             );
  //         }
  //     } catch (err) {
  //         console.error(err);
  //         // signTypedDataV4VerifyResult.innerHTML = `Error: ${err.message}`;
  //     }

  // }
}


function Owner() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return <Box h='100'>
    <ConnectButton handleOpenModal={onOpen} />
    <AccountModal isOpen={isOpen} onClose={onClose} />
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
    <Spacer />
    <Owner />
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
            props.handler(result?.text)
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
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += ("000" + hex).slice(-4);
  }

  return result
}

export default App
