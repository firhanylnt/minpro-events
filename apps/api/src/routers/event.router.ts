
import { AuthController } from '@/controllers/auth.controller';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', authMiddleware ,this.authController.getUsers);
    this.router.get('/:id', this.authController.getUsers);
    this.router.post('/register', this.authController.createUser);
    this.router.post('/login', this.authController.login);
  }

  getRouter(): Router {
    return this.router;
  }
}
