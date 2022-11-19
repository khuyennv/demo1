import { DataSource, DataSourceOptions } from "typeorm";

import config from "../../ormconfig";

const dataSource = new DataSource(config as DataSourceOptions); // config is one that is defined in dataSource.config.ts file
dataSource.initialize();

 export default dataSource; 
