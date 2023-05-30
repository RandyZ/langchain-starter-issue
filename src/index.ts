import * as dotenv from 'dotenv';
import { setGlobalDispatcher, ProxyAgent } from 'undici';
import { run as run1 } from './script/script1.ts';
import { run as run2 } from './script/script2.ts';

dotenv.config();
const proxyAgent = new ProxyAgent('http://172.16.5.147:30010');
// const proxyAgent = new ProxyAgent('http://127.0.0.1:10887');
setGlobalDispatcher(proxyAgent);

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set');
}

// await run1(apiKey);
await run2(apiKey);
