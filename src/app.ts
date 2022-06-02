import express, { Request, Response } from 'express';

const app = express();
const PORT = 4000;
app.get('/health', (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
