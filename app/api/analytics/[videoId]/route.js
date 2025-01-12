import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const propertyId = process.env.GA_PROPERTY_ID;

export async function GET(request, { params }) {
  const { videoId } = params;

  try {
    // Basic video metrics
    const [basicMetricsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [
        { name: "eventName" },
        { name: "customEvent:video_id" }, // Make sure this custom dimension exists in GA4
      ],
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
    });

    // Device breakdown
    const [deviceResponse] = await analyticsDataClient.runReport({
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
    });

    // Retention data
    const [retentionResponse] = await analyticsDataClient.runReport({
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
    });

    // Most watched segments
    const [segmentsResponse] = await analyticsDataClient.runReport({
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
    });

    // Process and transform the data
    const processResponse = (response) => {
      return (
        response.rows?.map((row) => ({
          dimensions: row.dimensionValues.map((dim) => dim.value),
          metrics: row.metricValues.map((metric) => metric.value),
        })) || []
      );
    };

    return Response.json({
      basicMetrics: processResponse(basicMetricsResponse),
      deviceTypes: processResponse(deviceResponse),
      retention: processResponse(retentionResponse),
      segments: processResponse(segmentsResponse),
    });
  } catch (error) {
    console.error("Google Analytics API Error:", error);
    return Response.json(
      {
        error: "Failed to fetch analytics data",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
