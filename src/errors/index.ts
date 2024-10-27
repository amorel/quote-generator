export class AppError extends Error {
    constructor(
      public message: string,
      public statusCode: number
    ) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message: string = 'Ressource non trouvée') {
      super(message, 404);
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string) {
      super(message, 400);
    }
  }
  
  export class ServiceError extends AppError {
    constructor(message: string) {
      super(message, 500);
    }
  }