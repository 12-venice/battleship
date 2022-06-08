import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const IS_DEV = process.env.NODE_ENV !== 'production';
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const DB = process.env.DB_CONN || '';
const { PORT } = process.env;
const IS_DEV_SERVER = process.env.SERVER === 'true';
const YANDEX_ID = '085740c0f5614f93a07ce6b4c4246a65';
const YANDEX_PASSWORD = 'cb927f496d9f4dc58b0cbac069671d97';

export {
    IS_DEV,
    SRC_DIR,
    DIST_DIR,
    DB,
    PORT,
    IS_DEV_SERVER,
    YANDEX_ID,
    YANDEX_PASSWORD,
};
