// create a API to get google analytics data from the API using @google-analytics/data

import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA_PROPERTY_ID;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export const GET = async () => {
  const dateRange = {
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  };

  try {
    // all the location of user and event data
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRange],
      dimensions: [
        { name: "country" }, // User's country
        { name: "city" }, // User's city
        { name: "eventName" }, // Name of the event (e.g., "play", "pause")
        { name: "pagePath" }, // Page URL path
        { name: "pageTitle" }, // Page title
      ],
      metrics: [
        { name: "eventCount" }, // Number of times the event occurred
        { name: "sessions" }, // Number of sessions
      ],
    });

    return Response.json(response);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred" }, { status: 500 });
  }
};
