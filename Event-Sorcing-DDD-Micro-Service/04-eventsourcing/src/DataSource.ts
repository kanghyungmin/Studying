

import { DataSource } from "typeorm"



export const PostgresDataSource = new DataSource({
    type: 'postgres', 
    host: 'localhost',
    port: 5454,
    username: "kang",
    password: "1234",
    database: "testDB",
    synchronize: true,
    migrationsRun : true,
    migrationsTransactionMode: 'all',
  }
) 



