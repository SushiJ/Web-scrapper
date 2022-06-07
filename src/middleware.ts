import { NextFunction, Request, Response } from 'express';

export function checkTickerAndKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { ticker } = req.params;
  const { key } = req.query;

  if (!ticker || !key) {
    res.status(400).send({ message: 'Please provide key and ticker' });
  } else next();
}
