export default async function deviceRoutes(server, options) {
  server.get('/api/device', async (request, reply) => {
    return {
      data: [
        {
          id: 1,
          name: 'Device 1',
          status: 'active',
          type: 'sensor',
        },
        {
          id: 2,
          name: 'Device 2',
          status: 'inactive',
          type: 'actuator',
        },
        {
          id: 3,
          name: 'Device 3',
          status: 'active',
          type: 'sensor',
        },
      ],
    };
  });
}
