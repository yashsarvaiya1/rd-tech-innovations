export type BaseService = {};

export class FirebaseError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "FirebaseError";
  }
}
