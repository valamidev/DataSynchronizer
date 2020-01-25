
// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { BaseDB, CandleDB } from '../database/index'

const createTableQuery = "CREATE TABLE `test` (`id` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
const dropTableQuery = "DROP TABLE `test`"


test('Database Create/Drop test', async () => {

    await BaseDB.query(createTableQuery);

    await BaseDB.query(dropTableQuery);

  

  expect(BaseDB._eventsCount).toBe(2);
  expect(CandleDB._eventsCount).toBe(2);
});
