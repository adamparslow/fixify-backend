// import dotenv from 'dotenv';
// // import path from 'path';

// export const setup = () => {
//     dotenv.config({ path: getEnvPath() });
// }

// const getEnvPath = () => {
//     const path = process.env.NODE_ENV === "production" ? '.env.prod' : '.env';
//     return process.cwd() + "/" + path
// }

import functions from 'firebase-functions';
import fs from 'fs';

let config = functions.config().env

if (process.env.NODE_ENV !== 'production') {
  if (fs.existsSync('./.env.local.json')) {
    const env = require('./.env.local.json');

    config = env;
  }
}

export default config;