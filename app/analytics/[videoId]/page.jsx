"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function VideoAnalytics() {
  const { videoId } = useParams();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/${videoId}`);
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  const formatBasicMetrics = () => {
    const metrics = {};
    analyticsData?.basicMetrics?.forEach((row) => {
      metrics[row.dimensionValues[0].value] = parseInt(
        row.metricValues[0].value
      );
    });
    return metrics;
  };

  const formatRetentionData = () => {
    return analyticsData?.retention?.map((row) => ({
      percentage: `${row.dimensionValues[0].value}%`,
      count: parseInt(row.metricValues[0].value),
    }));
  };

  const formatDeviceData = () => {
    return analyticsData?.deviceTypes?.map((row) => ({
      name: row.dimensionValues[0].value,
      value: parseInt(row.metricValues[0].value),
    }));
  };

  const formatSegmentsData = () => {
    if (!analyticsData?.segments?.[0]) return [];
    const segments = JSON.parse(
      analyticsData.segments[0].dimensionValues[0].value
    );
    return Object.entries(segments)?.map(([time, count]) => ({
      time: `${parseInt(time)}s`,
      views: count,
    }));
  };

  const metrics = formatBasicMetrics();
  const retentionData = formatRetentionData();
  const deviceData = formatDeviceData();
  const segmentsData = formatSegmentsData();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Video Analytics Dashboard</h1>

      {/* Basic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.video_start || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {metrics.video_start
                ? `${(
                    (metrics.video_complete / metrics.video_start) *
                    100
                  ).toFixed(1)}%`
                : "0%"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interaction Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(metrics.video_seek || 0) + (metrics.playback_rate_change || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Retention Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Viewer Retention</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="percentage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Device Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {deviceData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Most Watched Segments */}
      <Card>
        <CardHeader>
          <CardTitle>Most Watched Segments</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
