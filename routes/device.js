import { InfluxDB } from '@influxdata/influxdb-client';
import dotenv from 'dotenv';

dotenv.config();

// InfluxDB connection parameters
const url = process.env.INFLUXDB_URL;
const token = process.env.INFLUXDB_TOKEN;
const org = process.env.INFLUXDB_ORG;
const bucket = process.env.INFLUXDB_BUCKET;

export default async function deviceRoutes(server, options) {
  server.get('/api/device', async (request, reply) => {
    return {
      data: [
        {
          id: 'ECG-1',
          name: 'ECG-1',
        },
        {
          id: 'ECG-2',
          name: 'ECG-2',
        },
        {
          id: 'ECG-3',
          name: 'ECG-3',
        },
      ],
    };
  });

  // Get data for a specific device
  server.get('/api/device/:id', async (request, reply) => {
    const { id } = request.params;
    const { type, startDate, endDate } = request.query;

    try {
      const client = new InfluxDB({ url, token });
      const queryApi = client.getQueryApi(org);

      // Build Flux query based on provided parameters
      let query = `
      from(bucket: "${bucket}")
        |> range(start: ${startDate || '-1h'}, stop: ${endDate || 'now()'})
        |> filter(fn: (r) => r["_measurement"] == "emission")
        |> filter(fn: (r) => r["device_id"] == "${id}")
    `;

      // Add type filter if provided (CO, NO2, CO2, or TVOC)
      if (type) {
        query += `|> filter(fn: (r) => r["_field"] == "${type}")`;
      }

      query += `
        |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
        |> yield(name: "mean")
        |> sort(columns: ["_time"])
    `;

      // Execute query and collect results
      const results = [];
      const categories = [];
      const values = [];

      await new Promise((resolve, reject) => {
        queryApi.queryRows(query, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);

            // Store original format for reference
            results.push({
              time: o._time,
              value: o._value,
              field: o._field,
            });

            // Store data for ApexCharts format
            // Format the timestamp for display
            const timestamp = new Date(o._time);
            const formattedTime = timestamp.toLocaleString();
            categories.push(formattedTime);
            values.push(o._value);
          },
          error(error) {
            reject(error);
          },
          complete() {
            resolve();
          },
        });
      });

      // Format data for ApexCharts
      const seriesName = type || 'Reading';
      const chartData = {
        series: [
          {
            name: `${seriesName} Levels`,
            data: values,
          },
        ],
        options: {
          chart: {
            type: 'line',
            height: 500,
          },
          xaxis: {
            categories: categories,
          },
          fill: {
            colors: ['#6610f2'],
          },
          title: {
            text: `${type || 'All'} Readings for ${id}`,
            align: 'center',
          },
        },
      };

      return {
        data: results,
        chartData: chartData,
        query: {
          id,
          type,
          startDate,
          endDate,
        },
      };
    } catch (error) {
      console.error('Error querying InfluxDB:', error);
      reply.code(500).send({ error: 'Failed to retrieve data from InfluxDB' });
    }
  });

  // Add a route to get available measurement types for a device
  server.get('/api/device/:id/types', async (request, reply) => {
    const { id } = request.params;

    try {
      const client = new InfluxDB({ url, token });
      const queryApi = client.getQueryApi(org);

      const query = `
        from(bucket: "${bucket}")
          |> range(start: -24h)
          |> filter(fn: (r) => r["_measurement"] == "emission")
          |> filter(fn: (r) => r["device_id"] == "${id}")
          |> group(columns: ["_field"])
          |> distinct(column: "_field")
      `;

      const types = [];
      await new Promise((resolve, reject) => {
        queryApi.queryRows(query, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            types.push(o._field);
          },
          error(error) {
            reject(error);
          },
          complete() {
            resolve();
          },
        });
      });

      return {
        data: types,
      };
    } catch (error) {
      console.error('Error querying InfluxDB types:', error);
      reply
        .code(500)
        .send({ error: 'Failed to retrieve data types from InfluxDB' });
    }
  });

  // Add a new route to get summary statistics for all devices
  server.get('/api/device/stats', async (request, reply) => {
    try {
      const client = new InfluxDB({ url, token });
      const queryApi = client.getQueryApi(org);

      // Query for the latest values of each measurement type for each device
      const query = `
        from(bucket: "${bucket}")
          |> range(start: -1h)
          |> filter(fn: (r) => r["_measurement"] == "emission")
          |> filter(fn: (r) => r["_field"] == "CO" or r["_field"] == "NO2" or r["_field"] == "CO2" or r["_field"] == "TVOC")
          |> last()
          |> group(columns: ["device_id", "_field"])
      `;

      const stats = {};
      await new Promise((resolve, reject) => {
        queryApi.queryRows(query, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            const deviceId = o.device_id;
            const field = o._field;

            if (!stats[deviceId]) {
              stats[deviceId] = {};
            }

            stats[deviceId][field] = {
              value: o._value,
              time: o._time,
              unit: getUnitForField(field),
            };
          },
          error(error) {
            reject(error);
          },
          complete() {
            resolve();
          },
        });
      });

      return {
        data: stats,
      };
    } catch (error) {
      console.error('Error querying InfluxDB stats:', error);
      reply
        .code(500)
        .send({ error: 'Failed to retrieve statistics from InfluxDB' });
    }
  });
}

// Helper function to get units for each measurement type
function getUnitForField(field) {
  switch (field) {
    case 'CO':
      return 'ppm';
    case 'NO2':
      return 'ppb';
    case 'CO2':
      return 'ppm';
    case 'TVOC':
      return 'ppb';
    default:
      return '';
  }
}
