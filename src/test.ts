import { createPublicClient, createWalletClient, http } from "viem"
import IntegratedClient from "./clients/IntegratedClient"
import { base } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"
import { CONTRACT_ADDRESSES } from "./utils/config"
import PairsCache from "./rpc/pairs"

const main = async () => {
    const publicClient = createPublicClient({
        chain: base,
        transport: http(),
    }) as any

    const walletClient = createWalletClient({
        account: privateKeyToAccount("0x2f4a85f46cd75f2d31c0c0e855c8c2bd4568783de5664b248512b1c26977c976"),
        transport: http(),
        chain: base
    }) as any
    const client = new IntegratedClient(walletClient, publicClient)
    // const { read } = client.getContract("PairStorage", CONTRACT_ADDRESSES["PairStorage"])
    // const count = await read("pairsCount")
    // console.log("---- Count of Pairs ----")
    // console.log(count)
    const pc = new PairsCache(client)
    const info = await pc.getPairsInfo()
    console.log(info)
}

main().finally(() => {
    console.log("Main exited finally")
});