import {DataSourceCfg} from '../validator/config';
import { SourceType } from './Types';
import { DataProvider } from './DataProvider';
import { FileDataProvider } from './FileDataProvider';


export function NewDataProvider(ds: DataSourceCfg): DataProvider {
    if (ds.Type == SourceType.LocalFile) {
        console.log("Created FileDataProvider ...")
        return new FileDataProvider(ds.SchemaSrc, ds.FactsSrc, ds.RunningValuesSrc);
    }
    // TBD: for now onlye FileDataProvider
    return new FileDataProvider(ds.SchemaSrc, ds.FactsSrc, ds.RunningValuesSrc);
}