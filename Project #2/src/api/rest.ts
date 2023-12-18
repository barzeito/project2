import { VCoins } from "../interfaces/interface.js";
import CoinData from "../interfaces/coin-data.js";

export async function fetchCoins(url: string): Promise<VCoins[]> {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export async function fetchCoinData(url: string): Promise<CoinData> {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
