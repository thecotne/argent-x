import { describe, expect, test } from "vitest"

import { IExplorerTransaction } from "../../../../shared/explorer/type"
import { transformExplorerTransaction } from "../transform/transformExplorerTransaction"
import {
  accountCreated,
  accountUpgrade,
  dappAspectBuyNft,
  dappBriq,
  dappMintSquareBuyNft,
  dappNoGame,
  erc20MintTestToken,
  erc20SwapAlphaRoad,
  erc20SwapJediswap,
  erc20SwapMySwap,
  erc20Transfer,
  erc721MintAspect,
  erc721MintMintSquare,
  erc721Transfer,
} from "./__fixtures__/explorer-transactions/goerli-alpha"

describe("transformExplorerTransaction", () => {
  describe("when valid", () => {
    test("should return the expected transformation", () => {
      /** erc20 transfer */
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc20Transfer as IExplorerTransaction,
          accountAddress: "0x0",
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "10089999979820",
          "amount": "1000000000000000",
          "displayName": "Transfer",
          "fromAddress": "0x5f1f0a38429dcab9ffd8a786c0d827e84c1cbd8f60243e6d25d066a13af4a25",
          "maxFee": "15134999954595",
          "toAddress": "0x5417fc252d9b7b6ea311485a9e946cc814e3aa4d00f740f7e5f6b11ce0db9fa",
          "token": {
            "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            "decimals": 18,
            "image": "https://dv3jj1unlp2jl.cloudfront.net/128/color/eth.png",
            "name": "Ether",
            "network": "mainnet-alpha",
            "networkId": "mainnet-alpha",
            "showAlways": true,
            "symbol": "ETH",
          },
          "tokenAddress": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "type": "TRANSFER",
        }
      `)
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc20Transfer as IExplorerTransaction,
          accountAddress:
            "0x5f1f0a38429dcab9ffd8a786c0d827e84c1cbd8f60243e6d25d066a13af4a25",
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "10089999979820",
          "amount": "1000000000000000",
          "displayName": "Send",
          "fromAddress": "0x5f1f0a38429dcab9ffd8a786c0d827e84c1cbd8f60243e6d25d066a13af4a25",
          "maxFee": "15134999954595",
          "toAddress": "0x5417fc252d9b7b6ea311485a9e946cc814e3aa4d00f740f7e5f6b11ce0db9fa",
          "token": {
            "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            "decimals": 18,
            "image": "https://dv3jj1unlp2jl.cloudfront.net/128/color/eth.png",
            "name": "Ether",
            "network": "mainnet-alpha",
            "networkId": "mainnet-alpha",
            "showAlways": true,
            "symbol": "ETH",
          },
          "tokenAddress": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "type": "SEND",
        }
      `)
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc20Transfer as IExplorerTransaction,
          accountAddress:
            "0x5417fc252d9b7b6ea311485a9e946cc814e3aa4d00f740f7e5f6b11ce0db9fa",
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "10089999979820",
          "amount": "1000000000000000",
          "displayName": "Receive",
          "fromAddress": "0x5f1f0a38429dcab9ffd8a786c0d827e84c1cbd8f60243e6d25d066a13af4a25",
          "maxFee": "15134999954595",
          "toAddress": "0x5417fc252d9b7b6ea311485a9e946cc814e3aa4d00f740f7e5f6b11ce0db9fa",
          "token": {
            "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            "decimals": 18,
            "image": "https://dv3jj1unlp2jl.cloudfront.net/128/color/eth.png",
            "name": "Ether",
            "network": "mainnet-alpha",
            "networkId": "mainnet-alpha",
            "showAlways": true,
            "symbol": "ETH",
          },
          "tokenAddress": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "type": "RECEIVE",
        }
      `)

      /** erc20 mint */
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc20MintTestToken as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "5019500010039",
          "amount": "1000000000000000000000",
          "displayName": "Mint",
          "maxFee": "7529250015058",
          "token": {
            "address": "0x07394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10",
            "decimals": 18,
            "name": "Test Token",
            "network": "goerli-alpha",
            "networkId": "goerli-alpha",
            "symbol": "TEST",
          },
          "tokenAddress": "0x7394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10",
          "type": "MINT",
        }
      `)

      /** erc721 mint */
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc721MintAspect as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "10580000000000",
          "contractAddress": "0x3090623ea32d932ca1236595076b00702e7d860696faf300ca9eb13bfe0a78c",
          "displayName": "Mint NFT",
          "maxFee": "15870000000000",
          "tokenId": "3462",
          "type": "MINT_ERC721",
        }
      `)
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc721MintMintSquare as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "12404500000000",
          "contractAddress": "0x2f13075210b7252c826eafdc09d9d77ef272f582947f7adbd44ef79eae0062c",
          "displayName": "Mint NFT",
          "maxFee": "18606750037213",
          "tokenId": "45416",
          "type": "MINT_ERC721",
        }
      `)

      /** erc721 transfer */
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc721Transfer as IExplorerTransaction,
          accountAddress: "0x0",
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "20494725109306",
          "contractAddress": "0x25c1d0a3cfab1f5464b2e6a38c91c89bea77397744a7eb24b3f3645108d4abb",
          "displayName": "Transfer NFT",
          "fromAddress": "0x5f1f0a38429dcab9ffd8a786c0d827e84c1cbd8f60243e6d25d066a13af4a25",
          "maxFee": "30742087663959",
          "toAddress": "0x5417fc252d9b7b6ea311485a9e946cc814e3aa4d00f740f7e5f6b11ce0db9fa",
          "tokenId": "143",
          "type": "TRANSFER_ERC721",
        }
      `)
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc721Transfer as IExplorerTransaction,
          accountAddress:
            "0x5417fc252d9b7b6ea311485a9e946cc814e3aa4d00f740f7e5f6b11ce0db9fa",
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "20494725109306",
          "contractAddress": "0x25c1d0a3cfab1f5464b2e6a38c91c89bea77397744a7eb24b3f3645108d4abb",
          "displayName": "Receive NFT",
          "fromAddress": "0x5f1f0a38429dcab9ffd8a786c0d827e84c1cbd8f60243e6d25d066a13af4a25",
          "maxFee": "30742087663959",
          "toAddress": "0x5417fc252d9b7b6ea311485a9e946cc814e3aa4d00f740f7e5f6b11ce0db9fa",
          "tokenId": "143",
          "type": "RECEIVE_ERC721",
        }
      `)
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc721Transfer as IExplorerTransaction,
          accountAddress:
            "0x5f1f0a38429dcab9ffd8a786c0d827e84c1cbd8f60243e6d25d066a13af4a25",
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "20494725109306",
          "contractAddress": "0x25c1d0a3cfab1f5464b2e6a38c91c89bea77397744a7eb24b3f3645108d4abb",
          "displayName": "Send NFT",
          "fromAddress": "0x5f1f0a38429dcab9ffd8a786c0d827e84c1cbd8f60243e6d25d066a13af4a25",
          "maxFee": "30742087663959",
          "toAddress": "0x5417fc252d9b7b6ea311485a9e946cc814e3aa4d00f740f7e5f6b11ce0db9fa",
          "tokenId": "143",
          "type": "SEND_ERC721",
        }
      `)

      /** account */
      expect(
        transformExplorerTransaction({
          explorerTransaction: accountCreated as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "displayName": "Create acount",
          "type": "CREATE_ACCOUNT",
        }
      `)
      expect(
        transformExplorerTransaction({
          explorerTransaction: accountUpgrade as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "3831400030652",
          "displayName": "Upgrade account",
          "maxFee": "6000000000000",
          "type": "UPGRADE_ACCOUNT",
        }
      `)

      /** erc20 swap */
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc20SwapAlphaRoad as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "49915215635677",
          "dapp": {
            "host": "testnet.app.alpharoad.fi",
            "title": "Alpha Road",
          },
          "dappContractAddress": "0x4aec73f0611a9be0524e7ef21ab1679bdf9c97dc7d72614f15373d431226b6a",
          "displayName": "Sold ETH for unknown",
          "fromAmount": "211522156930263",
          "fromToken": {
            "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            "decimals": 18,
            "image": "https://dv3jj1unlp2jl.cloudfront.net/128/color/eth.png",
            "name": "Ether",
            "network": "mainnet-alpha",
            "networkId": "mainnet-alpha",
            "showAlways": true,
            "symbol": "ETH",
          },
          "fromTokenAddress": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "maxFee": "70744313503497",
          "toAmount": "55785188096947612154",
          "toTokenAddress": "0x72df4dc5b6c4df72e4288857317caf2ce9da166ab8719ab8306516a2fddfff7",
          "type": "SWAP",
        }
      `)
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc20SwapJediswap as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "36750992760053",
          "dapp": {
            "host": "app.testnet.jediswap.xyz",
            "title": "Jediswap",
          },
          "dappContractAddress": "0x12b063b60553c91ed237d8905dff412fba830c5716b17821063176c6c073341",
          "displayName": "Sold ETH for USDC",
          "fromAmount": "1000000000000000",
          "fromToken": {
            "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            "decimals": 18,
            "image": "https://dv3jj1unlp2jl.cloudfront.net/128/color/eth.png",
            "name": "Ether",
            "network": "mainnet-alpha",
            "networkId": "mainnet-alpha",
            "showAlways": true,
            "symbol": "ETH",
          },
          "fromTokenAddress": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "maxFee": "55126489140079",
          "toAmount": "9883",
          "toToken": {
            "address": "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426",
            "decimals": 6,
            "image": "https://dv3jj1unlp2jl.cloudfront.net/128/color/usdc.png",
            "name": "USD Coin",
            "network": "goerli-alpha",
            "networkId": "goerli-alpha",
            "symbol": "USDC",
          },
          "toTokenAddress": "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426",
          "type": "SWAP",
        }
      `)
      expect(
        transformExplorerTransaction({
          explorerTransaction: erc20SwapMySwap as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "35172000035172",
          "dapp": {
            "host": "www.myswap.xyz",
            "title": "mySwap",
          },
          "dappContractAddress": "0x18a439bcbb1b3535a6145c1dc9bc6366267d923f60a84bd0c7618f33c81d334",
          "displayName": "Sold ETH for DAI",
          "fromAmount": "100000000000000",
          "fromToken": {
            "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            "decimals": 18,
            "image": "https://dv3jj1unlp2jl.cloudfront.net/128/color/eth.png",
            "name": "Ether",
            "network": "mainnet-alpha",
            "networkId": "mainnet-alpha",
            "showAlways": true,
            "symbol": "ETH",
          },
          "fromTokenAddress": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          "maxFee": "52758000052758",
          "toAmount": "29852496290917474",
          "toToken": {
            "address": "0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9",
            "decimals": 18,
            "image": "https://dv3jj1unlp2jl.cloudfront.net/128/color/dai.png",
            "name": "DAI",
            "network": "goerli-alpha",
            "networkId": "goerli-alpha",
            "symbol": "DAI",
          },
          "toTokenAddress": "0x3e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9",
          "type": "SWAP",
        }
      `)

      /** buy NFT */
      expect(
        transformExplorerTransaction({
          explorerTransaction: dappAspectBuyNft as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "18270500000000",
          "contractAddress": "0x3090623ea32d932ca1236595076b00702e7d860696faf300ca9eb13bfe0a78c",
          "dapp": {
            "host": "aspect.io",
            "title": "Aspect",
          },
          "dappContractAddress": "0x6fcf30a53fdc33c85ab428d6c481c5d241f1de403009c4e5b66aeaf3edc890",
          "displayName": "Buy NFT",
          "maxFee": "27405750000000",
          "tokenId": "3462",
          "type": "BUY_ERC721",
        }
      `)
      expect(
        transformExplorerTransaction({
          explorerTransaction: dappMintSquareBuyNft as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "17222000000000",
          "contractAddress": "0x3090623ea32d932ca1236595076b00702e7d860696faf300ca9eb13bfe0a78c",
          "dapp": {
            "host": "mintsquare.io",
            "title": "Mint Square",
          },
          "dappContractAddress": "0x5bc8cc601c5098e20e9d9d74e86cfb0ec737f6f3ac571914dbe4f74aa249786",
          "displayName": "Buy NFT",
          "maxFee": "25832999948334",
          "tokenId": "3462",
          "type": "BUY_ERC721",
        }
      `)

      /** novel dapps */
      expect(
        transformExplorerTransaction({
          explorerTransaction: dappNoGame as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "13666550163999",
          "dapp": {
            "host": "nogamev0-1.netlify.app",
            "title": "NoGame",
          },
          "dappContractAddress": "0x35401b96dc690eda2716068d3b03732d7c18af7c0327787660179108789d84f",
          "displayName": "Crystal upgrade complete",
          "maxFee": "20499825245998",
          "type": "DAPP",
        }
      `)
      expect(
        transformExplorerTransaction({
          explorerTransaction: dappBriq as IExplorerTransaction,
        }),
      ).toMatchInlineSnapshot(`
        {
          "actualFee": "17607000123249",
          "dapp": {
            "host": "briq.construction",
            "title": "briq",
          },
          "dappContractAddress": "0x1317354276941f7f799574c73fd8fe53fa3f251084b4c04d88cf601b6bd915e",
          "displayName": "Assemble",
          "maxFee": "26410500211284",
          "type": "DAPP",
        }
      `)
    })
  })
  describe("when invalid", () => {
    test("should return undefined", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(transformExplorerTransaction({})).toBeUndefined()
    })
  })
})
