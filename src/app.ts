import express, { Request, Response } from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/health', (_: Request, res: Response) => {
  res.sendStatus(200);
});

app.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { key } = req.query;

  if (!ticker || !key) {
    res.status(400).send({ message: 'Please provide key and ticker' });
  }

  const url = `https://finance.yahoo.com/quote/${ticker}/history?p=${ticker}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const prices = $('td:nth-child(6)')
      .get()
      .map((val) => $(val).text());

    res.send(prices);
  } catch (error) {
    res.status(500).send({ message: `${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
