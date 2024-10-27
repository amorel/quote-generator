import { build } from './app';

const start = async () => {
  try {
    const app = await build();
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3000');
    console.log('Documentation available on http://localhost:3000/documentation');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();