
import { EventController } from '@/controllers/event.controller';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', authMiddleware ,this.eventController.getAllEvent);
    // this.router.get('/:id', this.eventController.getUsers);
    // this.router.post('/', this.eventController.createUser);
    // this.router.post('/:id', this.eventController.login);
  }

  getRouter(): Router {
    return this.router;
  }
}
