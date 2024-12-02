
import { AuthController } from '@/controllers/auth.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';
import { RegisterValidation, LoginValidation } from "../middlewares/validations/auth.validation";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', VerifyToken, AdminGuard ,this.authController.getUsers);
    this.router.get('/:id', VerifyToken, AdminGuard,this.authController.getUsers);
    this.router.post('/register', RegisterValidation, this.authController.createUser);
    this.router.post('/login', LoginValidation, this.authController.login);
  }

  getRouter(): Router {
    return this.router;
  }
}
