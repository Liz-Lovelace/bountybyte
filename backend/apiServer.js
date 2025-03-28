import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import * as rpcMethods from './rpcMethods.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { sleep } from './lib/utils.js';
import { happyPathResponse, catastrophicError, ErrorText, SET_COOKIE_SYMBOL, assert } from './lib/rpcUtils.js';
dotenv.config();

export function startApiServer() {
  const app = express();
  const PORT = 8000;
  
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  app.use(cors({
    origin: process.env.CURRENT_HOST,
    // credentials: true // remove if everything works after a deploy
  }));

  app.use(express.json());
  app.use(cookieParser());

  app.post('/rpc', async (req, res) => {
    try {
      if (process.env.SIMULATE_RPC_DELAY_MS) {
        await sleep(process.env.SIMULATE_RPC_DELAY_MS);
      }
      const { method, args } = req.body;
      console.log('method', req.body);
      assert(method, 'Method is required');
      assert(rpcMethods[method], `RPC method "${method}" not found`);

      let result = await rpcMethods[method]({...args, cookies: req.cookies});
      
      if (!result) {
        return res.json(happyPathResponse(null));
      }
      
      if (result[SET_COOKIE_SYMBOL]) {
        let cookie = result[SET_COOKIE_SYMBOL];
        return res
          .cookie(cookie.name, cookie.value, cookie.options)
          .json(happyPathResponse(null));
      }

      res.json(result);
    } catch (error) {
      console.error(error);
      if (error instanceof ErrorText) {
        return res.status(500).json(catastrophicError(error.message));
      } 
      return res.status(500).json(catastrophicError('Something went wrong'));
    }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Proxying requests from :8000 to Vite dev server at :5173');
    app.use('/', createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
    }));
  } else {
    app.use('/', express.static(path.join(__dirname, '../dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API Server listening on port ${PORT}`);
  });
} 