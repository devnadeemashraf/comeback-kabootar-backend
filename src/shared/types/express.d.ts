/** User attached to Express Request by auth middleware; contract between auth and controllers (e.g. /me). */
export interface RequestUser {
  id: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};
