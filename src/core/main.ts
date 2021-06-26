
import {DataProvider} from './dataprovider/DataProvider';
import {NewDataProvider} from './dataprovider/DataProviderFactory';
import {Trade, TradeFact} from './shared/Types';
import {TradeValidator} from './validator/validator';
// import {LoadTrades} from './validator/tradeloader';
import {Cache, NewCache} from './cache/Cache';
import {DataSourceCfg, LoadConfig} from './validator/config';
import { ErrorObject } from "ajv";

import { ValidationError } from './shared/Types';

class Result {
    public errors: ValidationError[]
    public success: Boolean

    constructor() {
        this.errors = []
        this.success = true
    }
}

const appRoot = require('app-root-path');

export function Validate(trades: Trade[]) {
    process.env["NODE_CONFIG_DIR"] = appRoot + "/config";
    console.log("Loading configurations ...")
    let ds: DataSourceCfg = LoadConfig();

    console.log("Creating data provider as configured ...")
    let provider: DataProvider = NewDataProvider(ds);

    console.log("Creating cache from data provider ...")
    let cache: Cache = NewCache(provider)

    // console.log("Loading Trades for validation ...")
    // let trades: Array<Trade> = LoadTrades(ds.InputData.TradesSrc);

    console.log("Finally Validate ...")
    let tv = new TradeValidator(cache)
    let errors =  tv.Validate(trades)
    let result = new Result()
    if ((errors === false) || (errors === null) || (errors === undefined)) {
        result.errors = []
    } else {
        result = transformErrors(errors)
    }

    return result
}

function transformErrors(errors: ErrorObject[]) {
    let result = new Result()
    result.success = false

    let tv_errors: ValidationError[];

    errors.forEach(error => {
        result.errors.push(new ValidationError(error));
    })

    return result
}