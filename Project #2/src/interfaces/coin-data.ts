export default interface CoinData {
    symbol: any;
    name: any;
    image: {
        thumb: string;
    }
    market_data: {
        current_price: {
            usd: number;
            eur: number;
            ils: number;
        }
    }
}