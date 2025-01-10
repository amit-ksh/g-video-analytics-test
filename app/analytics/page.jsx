"use client";
import { useState, useEffect } from "react";

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    completionRate: 0,
    averageWatchTime: 0,
    engagementByQuarter: {
      "25%": 0,
      "50%": 0,
      "75%": 0,
      "100%": 0,
    },
  });

  useEffect(() => {
    // In a real application, you would fetch this data from your Google Analytics API
    // This is just mock data for demonstration
    setAnalyticsData({
      totalViews: 150,
      completionRate: 68,
      averageWatchTime: 245,
      engagementByQuarter: {
        "25%": 120,
        "50%": 95,
        "75%": 82,
        "100%": 68,
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Video Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{analyticsData.totalViews}</p>
              </div>
              <div>
                <p className="text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {analyticsData.completionRate}%
                </p>
              </div>
              <div>
                <p className="text-gray-600">Average Watch Time</p>
                <p className="text-2xl font-bold">
                  {Math.floor(analyticsData.averageWatchTime / 60)}m{" "}
                  {analyticsData.averageWatchTime % 60}s
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Engagement by Quarter
            </h2>
            <div className="space-y-4">
              {Object.entries(analyticsData.engagementByQuarter).map(
                ([quarter, views]) => (
                  <div key={quarter}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">{quarter}</span>
                      <span className="text-gray-900 font-semibold">
                        {views} views
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(views / analyticsData.totalViews) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
