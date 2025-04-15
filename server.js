import Fastify from 'fastify';
import FastifyVite from '@fastify/vite';
import deviceRoutes from './routes/device.js';
const server = Fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
    },
  },
});

await server.register(FastifyVite, {
  root: import.meta.url,
  renderer: '@fastify/vue',
});

await server.register(deviceRoutes);

await server.vite.ready();
await server.listen({ port: 3000 });
