"use client";
import { useState, useEffect } from "react";

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => setAnalyticsData(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Video Analytics Dashboard
        </h1>

        <div className="text-black bg-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(analyticsData || {}).map(([key, value]) => (
            <div key={key}>
              <h2 className="text-lg font-semibold">{key}</h2>
              {typeof value === "object" ? (
                <pre>{JSON.stringify(value, null, 2)}</pre>
              ) : (
                <span>{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
