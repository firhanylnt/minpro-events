
import { EventController } from '@/controllers/event.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', VerifyToken, AdminGuard, this.eventController.getAllEvent);
    this.router.get('/:slug', VerifyToken ,this.eventController.getEventBySlug);
    this.router.post('/', VerifyToken, AdminGuard, this.eventController.createEvent);
    this.router.post('/:id', VerifyToken, AdminGuard, this.eventController.updateEvent);
  }

  getRouter(): Router {
    return this.router;
  }
}
