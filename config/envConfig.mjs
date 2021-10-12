import dotenv from 'dotenv';
import path from 'path';

export const setup = () => {
    dotenv.config({ path: getEnvPath() });
}

const getEnvPath = () => {
    const path = process.env.NODE_ENV === "production" ? '.env.prod' : '.env';
    return process.cwd() + "/" + path
}