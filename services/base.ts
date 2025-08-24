export interface BaseService {
  // Common error handling and utilities
}

export class FirebaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FirebaseError';
  }
}
