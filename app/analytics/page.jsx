"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AnalyticsPage() {
  const [processedData, setProcessedData] = useState({
    eventCounts: [],
    pageViews: [],
    totalEvents: 0,
    totalSessions: 0,
  });

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        processAnalyticsData(data);
      });
  }, []);

  const processAnalyticsData = (data) => {
    if (!data?.rows) return;

    // Process event counts
    const eventMap = new Map();
    const pageViewMap = new Map();
    let totalEvents = 0;
    let totalSessions = 0;

    data.rows.forEach((row) => {
      const eventName = row.dimensionValues[2].value;
      const pagePath = row.dimensionValues[3].value;
      const eventCount = parseInt(row.metricValues[0].value);
      const sessions = parseInt(row.metricValues[1].value);

      // Aggregate event counts
      eventMap.set(eventName, (eventMap.get(eventName) || 0) + eventCount);

      // Aggregate page views
      pageViewMap.set(pagePath, (pageViewMap.get(pagePath) || 0) + eventCount);

      totalEvents += eventCount;
      totalSessions += sessions;
    });

    setProcessedData({
      eventCounts: Array.from(eventMap, ([name, value]) => ({ name, value })),
      pageViews: Array.from(pageViewMap, ([name, value]) => ({ name, value })),
      totalEvents,
      totalSessions,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Video Analytics Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Events</h2>
            <p className="text-3xl font-bold text-blue-600">
              {processedData.totalEvents}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Sessions</h2>
            <p className="text-3xl font-bold text-green-600">
              {processedData.totalSessions}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Count Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Events Distribution</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData.eventCounts}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Page Views Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Page Views Distribution
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedData.pageViews}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                  >
                    {processedData.pageViews.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
