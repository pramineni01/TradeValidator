// import * as config from "config";
const config = require("config");
// import { NewDataProvider } from '../dataprovider/DataProviderFactory';

export type DataSourceCfg = {
    Type: string;
    SchemaSrc: string;
    FactsSrc: string;
    RunningValuesSrc: string;
    InputData: {
        TradesSrc: string
    }
};

// Loads config from config fiile
export function LoadConfig(): DataSourceCfg {
  let ds: DataSourceCfg = config.get('DataSource');
  if (ds === undefined || ds.Type == "") {
    console.log("config.ts: failed to fetch data source type");
  }
  return ds;
}