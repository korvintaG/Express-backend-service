export interface JWTPayload {
  id: string;
  role: string;
}

export {};


declare global {
  namespace Express {
    export interface Request {
      user?: JWTPayload;
    }
  }
} 