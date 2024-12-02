
import { TransactionController } from '@/controllers/transaction.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', VerifyToken, AdminGuard ,this.transactionController.getTransactions);
  }

  getRouter(): Router {
    return this.router;
  }
}
