import functions from 'firebase-functions';
import fs from 'fs';

let config = functions.config().env;

if (process.env.NODE_ENV !== 'production') {
  if (fs.existsSync('./config/.env.local.json')) {
    const response = fs.readFileSync('./config/.env.local.json')
    const env = JSON.parse(response);

    config = env;
  } 
}

export default config;