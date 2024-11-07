import {
  connectDB,
  getCurrentConnection,
  closeMemoryServer,
} from "./config/database";

// Variables d'environnement pour les tests
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.USE_MEMORY_DB = "true";

beforeAll(async () => {
  process.env.USE_MEMORY_DB = "true";
  await connectDB();
}, 120000);

afterAll(async () => {
  const connection = getCurrentConnection();
  if (connection) {
    await connection.close();
  }
  await closeMemoryServer();
});

beforeEach(async () => {
  const connection = getCurrentConnection();
  if (connection && connection.collections) {
    for (const key in connection.collections) {
      await connection.collections[key].deleteMany({});
    }
  }
});
