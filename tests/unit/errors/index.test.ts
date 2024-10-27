import {
  AppError,
  NotFoundError,
  ValidationError,
  ServiceError,
} from "../../../src/errors";

describe("Errors", () => {
  it("should create AppError with correct properties", () => {
    const error = new AppError("Test error", 400);
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe("AppError");
  });

  it("should create NotFoundError with correct properties", () => {
    const error = new NotFoundError("Not found");
    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
  });

  it("should create ValidationError with correct properties", () => {
    const error = new ValidationError("Invalid data");
    expect(error.message).toBe("Invalid data");
    expect(error.statusCode).toBe(400);
  });

  it("should create ServiceError with correct properties", () => {
    const error = new ServiceError("Service error");
    expect(error.message).toBe("Service error");
    expect(error.statusCode).toBe(500);
  });

  it("should capture stack trace", () => {
    const error = new AppError("Test error", 400);
    expect(error.stack).toBeDefined();
  });

  it("should set error properties correctly", () => {
    const error = new AppError("Test error", 400);
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe("AppError");
  });

  it("should inherit from Error", () => {
    const error = new AppError("Test error", 400);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should properly capture stack trace', () => {
    const error = new AppError('Test error', 400);
    expect(error.stack).toBeDefined();
    expect(error.stack?.includes('AppError: Test error')).toBe(true);
  });

  it('should properly set error name', () => {
    const error = new AppError('Test error', 400);
    expect(error.name).toBe('AppError');
    expect(Object.getPrototypeOf(error).constructor.name).toBe('AppError');
  });

  describe("Error Handling Edge Cases", () => {
    it("should handle error with no stack trace", () => {
      const error = new AppError("Test error", 400);
      delete error.stack;  // Force la condition où stack est undefined
      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(400);
    });
  
    it("should handle inherited error properties", () => {
      class CustomError extends AppError {
        constructor() {
          super("Custom error", 418);
        }
      }
      const error = new CustomError();
      expect(error.statusCode).toBe(418);
      expect(error.message).toBe("Custom error");
    });
  });
});
