import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes/api';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Use the routes defined in routes/index.js
app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
