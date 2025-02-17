import IntegratedClient from "../clients/IntegratedClient";
import { CONTRACT_ADDRESSES } from "../utils/config";
import { encodeAbiParameters, encodeFunctionData, keccak256 } from "viem";

class PairsCache {
    private client: IntegratedClient; // Replace 'any' with the actual type of your client
    // TODO: Add PairInfoWithData Object Type
    private pairInfoCache: { [key: number]: any } = {};
    private groupIndexesCache: Set<number> = new Set();
    private pairMapping: { [key: string]: number } = {};

    constructor(client: any) {
        // Replace 'any' with the actual type of your client
        this.client = client;
    }

    // TODO: Add PairInfoWithData Object Type
    async getPairsInfo(
        forceUpdate: boolean = false
    ): Promise<{ [key: number]: any }> {
        if (!forceUpdate && Object.keys(this.pairInfoCache).length === 0) {
            const Multicall = this.client.getContract(
                "Multicall",
                CONTRACT_ADDRESSES["Multicall"]
            );
            const PairStorage = this.client.getContract(
                "PairStorage",
                CONTRACT_ADDRESSES["PairStorage"]
            );
            const pairsCount = await this.getPairsCount();

            const calls = [];
            for (let pairIndex = 0; pairIndex < pairsCount; pairIndex++) {
                const coreCallData = encodeFunctionData(
                    { abi: PairStorage.abi, functionName: "pairs", args: [pairIndex] }
                );
                const pairDataCallData = encodeFunctionData(
                    { abi: PairStorage.abi, functionName: "getPairData", args: [pairIndex] }
                );
                calls.push(
                    [CONTRACT_ADDRESSES["PairStorage"], coreCallData],
                    [CONTRACT_ADDRESSES["PairStorage"], pairDataCallData]
                );
            }

            const rawData: any = await Multicall.read("aggregate", calls);
            console.log(rawData)
            // TODO: Add PairInfoWithData Object Type
            const decodedData: Array<any> = [];
            for (let i = 0; i < rawData.length; i += 2) {
                const pairInfo = rawData[i]
                const pairData = rawData[i + 1]
                // TODO: Add PairInfoWithData Object Type
                decodedData.push({ pairInfo, pairData });
            }

            decodedData.forEach((pairInfo, index) => {
                if (!pairInfo.from_) {
                    pairInfo.from_ = `DELISTED_${index}`;
                    pairInfo.to = `DELISTED_${index}`;
                }
                this.pairInfoCache[index] = pairInfo;
            });

            this.groupIndexesCache = new Set(
                decodedData.map((pair) => pair.group_index)
            );
            this.pairMapping = Object.fromEntries(
                Object.entries(this.pairInfoCache).map(([index, info]) => [
                    `${info.from_}/${info.to}`,
                    parseInt(index),
                ])
            );
        }

        return this.pairInfoCache;
    }

    async getPairsCount(): Promise<number> {
        const PairStorage = this.client.getContract(
            "PairStorage",
            CONTRACT_ADDRESSES["PairStorage"]
        );
        return (await PairStorage.read("pairsCount")) as number;
    }

    async getGroupIndexes(): Promise<Set<number>> {
        if (this.groupIndexesCache.size === 0) {
            await this.getPairsInfo();
        }
        return this.groupIndexesCache;
    }

    async getPairIndex(pair: string): Promise<number> {
        const pairsInfo = await this.getPairsInfo();
        for (const [index, pairInfo] of Object.entries(pairsInfo)) {
            if (`${pairInfo.from_}/${pairInfo.to}` === pair) {
                return parseInt(index);
            }
        }
        throw new Error(`Pair ${pair} not found in pairs info.`);
    }

    async getPairNameFromIndex(pairIndex: number): Promise<string> {
        const pairsInfo = await this.getPairsInfo();
        const pairInfo = pairsInfo[pairIndex];
        return `${pairInfo.from_}/${pairInfo.to}`;
    }
}

export default PairsCache;
