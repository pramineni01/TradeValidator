import { ErrorObject } from "ajv";

export const enum Direction {
    "BUY",
    "SELL"
};

// A resource can be anything which can be traded on.
// A resource is upon which we define rules. The later are used to validated a trade data (in full or partial)
// For example:
// 1. Asset
// 2. Asset + Product
// 3. Market + Product
// 4. Start_date + End_date + 3
export interface ResourceFact {
    start_date?: Date;
    end_date?: Date;
    portfolio?: string;
    asset?: string;
    direction?: Direction;
    market?: string;
    product?: string;
    facts: Map<string, number>;
}

// Trades represents trades that will be validated
export interface Trade {
    start_date: Date;
    end_date: Date;
    portfolio: string;
    asset: string;
    market: string;
    product: string;
    quantity: number;
    price: number;
}

export type Facts = Map<string, number>;

export interface TradeFact {
    start_date: Date;
    end_date: Date;
    portfolio: string;
    asset: string;
    direction: Direction;
    market?: string;
    product?: string;
    facts: Map<string, number>;
}

export class ValidationError {
    seq_id: string;
    keyword: string;
    field: string;
    value?: string;
    error_message: string;
    allowed?: string[];

    constructor( error: ErrorObject ) {
        /// split instancepath => 
        let instData: string[] = error.instancePath.split('/')

        this.seq_id = instData[1];
        this.keyword = error.keyword;
        this.field = instData[2];
        this.value = error.data as string;
        this.error_message = error.message as string;
        
        if (error.keyword === 'enum') {
            this.allowed = [];
            (error.schema as string[]).forEach(val => this.allowed.push(val as string));
        }
    }
}

export type TradeIdentifier = Partial<Omit<TradeFact, "facts"> >



/**
 * Describes parameter type to trade keyword handlers.
 * Passed in as "data".
 */
// export interface TradeParameter {
//     field: string;
//     trade: Trade;
// };