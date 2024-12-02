import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT, WEB_URL } from './config';
import { AuthRouter } from './routers/auth.router';
import { EventRouter } from './routers/event.router';
import { TransactionRouter } from './routers/transaction.router';

import helmet from "helmet";
import ErrorMiddleware from "./middlewares/errorMiddleware";

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
  }

  private configure(): void {
    this.app.use(cors({
      origin: WEB_URL || 'http://localhost:3000',
      credentials: true,
    }));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(helmet());
    this.routes();
    this.app.use(ErrorMiddleware);
  }

  private routes(): void {
    const authRouter = new AuthRouter();
    const eventRouter = new EventRouter();
    const transactionRouter = new TransactionRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/events', eventRouter.getRouter());
    this.app.use('/api/transactions', transactionRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
