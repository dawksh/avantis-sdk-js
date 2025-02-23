type Contracts = "TradingStorage" | "PairStorage" | "PairInfos" | "PriceAggregator" | "USDC" | "Trading" | "Multicall" | "Referral"

const MAINNET_ADDRESSES: Record<Contracts, `0x${string}`> = {
    "TradingStorage": "0x8a311D7048c35985aa31C131B9A13e03a5f7422d",
    "PairStorage": "0x5db3772136e5557EFE028Db05EE95C84D76faEC4",
    "PairInfos": "0x81F22d0Cc22977c91bEfE648C9fddf1f2bd977e5",
    "PriceAggregator": "0x64e2625621970F8cfA17B294670d61CB883dA511",
    "USDC": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "Trading": "0x5FF292d70bA9cD9e7CCb313782811b3D7120535f",
    "Multicall": "0xD4693314460d6fb598C1124aeC40C03e2Aa0A8a4",
    "Referral": "0xA96f577821933d127B491D0F91202405B0dbB1bd",
}

export const AVANTIS_SOCKET_API = "https://socket-api.avantisfi.com/v1/data"

export const CONTRACT_ADDRESSES = MAINNET_ADDRESSES
