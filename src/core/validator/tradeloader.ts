import * as fs from 'fs-extra';

// Loads trades
export function LoadTrades(tradesSrc: string) {
    // load trades from source
    console.log(`Trades source: ${tradesSrc}\n`);
    const tradesObj = fs.readJsonSync(tradesSrc);
    if (tradesObj === null) {
        console.log("Cache: Trades load failed.")
        return null;
    }

    return tradesObj;
}