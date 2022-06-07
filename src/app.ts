import express, { Request, Response } from 'express';

import getStockInfo from './controller/getStockInfo';
import { checkTickerAndKey } from './middleware';

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/health', (_: Request, res: Response) => {
  res.sendStatus(200);
});

app.get('/:ticker', checkTickerAndKey, getStockInfo);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
