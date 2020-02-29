'use strict';

import { logger } from '../logger';
import { BaseDB } from '../database';
import { RowDataPacket } from 'mysql2';

export const sentimentUtil = {
  loadSentiments: async (type = 'none'): Promise<RowDataPacket[] | undefined> => {
    try {
      const [rows] = await BaseDB.query('SELECT `name` FROM `sentiments` WHERE `type` = ?;', [type]);

      return rows as RowDataPacket[];
    } catch (e) {
      logger.error('SQL error', e);
    }
  },
};
