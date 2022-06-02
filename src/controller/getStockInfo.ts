import { NextFunction, Request, Response } from 'express';
import cheerio from 'cheerio';
import axios from 'axios';
import { metrics } from '../constants';

async function getStockInfo(req: Request, res: Response, next: NextFunction) {
  const { ticker } = req.params;
  const { key } = req.query;

  if (!ticker || !key) {
    res.status(400).send({ message: 'Please provide key and ticker' });
  }

  try {
    const stockInfo = await Promise.all(
      ['key-statistics', 'history'].map(async (type) => {
        const url = `https://finance.yahoo.com/quote/${ticker}/${type}?p=${ticker}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        if (type === 'history') {
          const prices = $('td:nth-child(6)')
            .get()
            .map((val) => $(val).text());
          return { prices };
        }

        if (type === 'key-statistics') {
          const stats = $(
            'section[data-test="qsp-statistics"] > div:nth-child(3) tr'
          )
            .get()
            .map((val) => {
              const $ = cheerio.load(val);
              const keyVals = $('td')
                .get()
                .splice(0, 2)
                .map((val) => $(val).text());
              return keyVals;
            })
            .reduce((acc, curr) => {
              if (curr.length < 1) {
                return acc;
              }
              const includedCheck = metrics.reduce((acc, curr2) => {
                if (acc === true) {
                  return true;
                }
                return curr[0].includes(curr2);
              }, false);

              if (!includedCheck) {
                return acc;
              }

              return { ...acc, [curr[0]]: curr[1] };
            }, {});
          return { financials: stats };
        }
      })
    );
    res.status(200).send({
      [ticker]: stockInfo.reduce((acc, curr) => {
        return { ...acc, [Object.keys(curr)[0]]: Object.values(curr)[0] };
      }, {}),
    });
  } catch (error) {
    console.log(error.message);
  }
}

export default getStockInfo;
