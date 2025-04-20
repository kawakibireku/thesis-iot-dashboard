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

  server.get('/api/device/:id', async (request, reply) => {
    const { id } = request.params;
    const { type, startDate, endDate } = request.query;

    try {
      const client = new InfluxDB({ url, token });
      const queryApi = client.getQueryApi(org);

      // Calculate date range in milliseconds
      let start = startDate || '-1h';
      let end = endDate || 'now()';

      // Calculate time difference if actual dates are provided
      let aggregationWindow = '1m'; // Default aggregation window (1 minute)

      // Only calculate if both dates are provided as ISO strings
      if (
        startDate &&
        endDate &&
        !startDate.startsWith('-') &&
        !endDate.startsWith('now')
      ) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const diffInDays = (endDateObj - startDateObj) / (1000 * 60 * 60 * 24);

        // Adjust aggregation window based on date range
        if (diffInDays > 7) {
          // More than 7 days - aggregate by day
          aggregationWindow = '1d';
        } else if (diffInDays > 2) {
          // 2-7 days - aggregate by hour
          aggregationWindow = '1h';
        } else if (diffInDays > 1) {
          // 1-2 days - aggregate by 30 minutes
          aggregationWindow = '30m';
        } else {
          // Less than 1 day - aggregate by minute
          aggregationWindow = '1m';
        }
      }

      // Build Flux query based on provided parameters
      let query = `
    from(bucket: "${bucket}")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r["_measurement"] == "emission")
      |> filter(fn: (r) => r["device_id"] == "${id}")
  `;

      // Add type filter if provided (CO, NO2, CO2, or TVOC)
      if (type) {
        query += `|> filter(fn: (r) => r["_field"] == "${type}")`;
      }

      query += `
      |> aggregateWindow(every: ${aggregationWindow}, fn: mean, createEmpty: false)
      |> yield(name: "mean")
      |> sort(columns: ["_time"])
      |> distinct(column: "_time")
  `;

      console.log(
        `Using aggregation window: ${aggregationWindow} for date range: ${start} to ${end}`
      );

      // Execute query and collect results
      const results = [];
      const timeMap = new Map(); // Use a Map to deduplicate by timestamp

      await new Promise((resolve, reject) => {
        queryApi.queryRows(query, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);

            // Validate that we have proper time and value fields
            if (o._time && typeof o._value === 'number') {
              // Store original format for reference
              results.push({
                time: o._time,
                value: o._value,
                field: o._field,
              });

              try {
                // Store data for ApexCharts format, deduplicated by timestamp
                const timestamp = new Date(o._time);

                // Skip invalid timestamps
                if (isNaN(timestamp.getTime())) {
                  console.warn('Invalid timestamp:', o._time);
                  return;
                }

                let formattedTime;

                // Format the time based on aggregation window
                if (aggregationWindow === '1d') {
                  formattedTime = timestamp.toLocaleDateString();
                } else if (
                  aggregationWindow === '1h' ||
                  aggregationWindow === '30m'
                ) {
                  formattedTime = timestamp.toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                } else {
                  formattedTime = timestamp.toLocaleString();
                }

                // Use Map to deduplicate entries with the same timestamp
                if (!timeMap.has(formattedTime)) {
                  timeMap.set(formattedTime, o._value);
                }
              } catch (err) {
                console.warn('Error processing timestamp:', err);
              }
            }
          },
          error(error) {
            reject(error);
          },
          complete() {
            resolve();
          },
        });
      });

      // Convert the Map to arrays for categories and values
      const categories = Array.from(timeMap.keys());
      const values = Array.from(timeMap.values());

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
            animations: {
              enabled: true,
              easing: 'easeinout',
              speed: 800,
            },
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
            },
          },
          stroke: {
            curve: 'smooth',
            width: 3,
          },
          xaxis: {
            categories: categories,
            title: {
              text: 'Date',
              style: {
                fontSize: '14px',
                fontWeight: 'bold',
              },
            },
            labels: {
              rotateAlways: false,
              hideOverlappingLabels: true,
            },
          },
          yaxis: {
            title: {
              text: `${seriesName} (${getUnitForField(type)})`,
              style: {
                fontSize: '14px',
                fontWeight: 'bold',
              },
            },
          },
          fill: {
            colors: ['#6610f2'],
            type: 'gradient',
            gradient: {
              shade: 'dark',
              type: 'vertical',
              shadeIntensity: 0.5,
              gradientToColors: ['#ba54f5'],
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 0.8,
            },
          },
          title: {
            text: `${type || 'All'} Readings for ${id}`,
            align: 'center',
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
            },
          },
          tooltip: {
            x: {
              show: true,
            },
            y: {
              formatter: function (value) {
                return `${value.toFixed(2)} ${getUnitForField(type)}`;
              },
            },
          },
          markers: {
            size: 5,
            hover: {
              size: 7,
            },
          },
          grid: {
            show: true,
            borderColor: '#90A4AE',
            strokeDashArray: 0,
            position: 'back',
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
          aggregationWindow,
        },
      };
    } catch (error) {
      console.error('Error querying InfluxDB:', error);
      reply.code(500).send({
        error: 'Failed to retrieve data from InfluxDB',
        details: error.message,
      });
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
