export type User = {
    email: string;
    name: string;
    role: string;
    organizer: number;
  };
  
  declare global {
    namespace Express {
      export interface Request {
        user?: User;
      }
    }
  }