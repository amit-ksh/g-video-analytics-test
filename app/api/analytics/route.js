import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const propertyId = process.env.GA_PROPERTY_ID;

export async function GET() {
  const [viewsReport, eventsReport, deviceReport, retentionReport] =
    await Promise.allSettled([
      // Get total views and watch time
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
        dimensions: [{ name: "date" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: {
              value: "video_start",
            },
          },
        },
      }),

      // Get event breakdown
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [{ name: "eventCount" }],
        dimensions: [{ name: "eventName" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: {
              matchType: "BEGINS_WITH",
              value: "video_",
            },
          },
        },
      }),

      // // Get device breakdown
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [{ name: "eventCount" }],
        dimensions: [{ name: "deviceCategory" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: {
              value: "video_start",
            },
          },
        },
      }),

      // // Get retention data
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [{ name: "eventCount" }],
        dimensions: [{ name: "customEvent:retention_percentage" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: {
              value: "video_retention",
            },
          },
        },
      }),
    ]);

  return Response.json({
    viewsData: viewsReport?.value?.[0]?.rows,
    eventsData: eventsReport?.value?.[0]?.rows,
    deviceData: deviceReport?.value?.[0]?.rows,
    retentionData: retentionReport?.value?.[0]?.rows,
    errors: [
      viewsReport?.reason?.message,
      eventsReport?.reason?.message,
      deviceReport?.reason?.message,
      retentionReport?.reason?.message,
    ].filter(Boolean),
  });
}
