import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const propertyId = process.env.GA_PROPERTY_ID;

export async function GET(request, { params }) {
  const { videoId } = await params;

  const analyticsRequests = [
    // Basic video metrics
    analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "eventName" }, { name: "customEvent:video_id" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: "customEvent:video_id",
                stringFilter: {
                  value: videoId,
                  matchType: "EXACT",
                },
              },
            },
            {
              filter: {
                fieldName: "eventName",
                stringFilter: {
                  matchType: "CONTAINS_CASE_SENSITIVE",
                  value: "video_",
                },
              },
            },
          ],
        },
      },
    }),

    // Device breakdown
    analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "device" }, { name: "customEvent:video_id" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "customEvent:video_id",
          stringFilter: {
            value: videoId,
            matchType: "EXACT",
          },
        },
      },
    }),

    // Retention data
    analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [
        { name: "customEvent:retention_percentage" },
        { name: "customEvent:video_id" },
      ],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "customEvent:video_id",
          stringFilter: {
            value: videoId,
            matchType: "EXACT",
          },
        },
      },
    }),

    // Most watched segments
    analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [
        { name: "customEvent:segments" },
        { name: "customEvent:video_id" },
      ],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "customEvent:video_id",
          stringFilter: {
            value: videoId,
            matchType: "EXACT",
          },
        },
      },
    }),
  ];

  const results = await Promise.allSettled(analyticsRequests);

  const processResponse = (response) => {
    if (!response || !response.rows) return [];
    return response.rows.map((row) => ({
      dimensions: row.dimensionValues.map((dim) => dim.value),
      metrics: row.metricValues.map((metric) => metric.value),
    }));
  };

  const [basicMetrics, deviceTypes, retention, segments] = results.map(
    (result) =>
      result.status === "fulfilled" ? processResponse(result.value[0]) : []
  );

  return Response.json({
    basicMetrics,
    deviceTypes,
    retention,
    segments,
    errors: results
      .map((result, index) =>
        result.status === "rejected"
          ? {
              type: ["basicMetrics", "deviceTypes", "retention", "segments"][
                index
              ],
              error: result.reason?.message,
            }
          : null
      )
      .filter(Boolean),
  });
}
